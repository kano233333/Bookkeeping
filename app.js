//app.js
App({
  onLaunch: function () {
  },
  globalData: {
    userInfo: null,
    userStatus:'',
    // ip:'https://www.victorzuo.top/wx',
    ip:'http://192.168.1.70:8080/wx/',
    intervalTime:60000,
    day : [1,30,99,199,299,365],
    bill : [1,49,99,199,299,399]
  },
  requestFail:function(xxx){
    wx.showToast({
      title: '错误',
      duration: 1000,
      icon:"none"
    })
  },
  isSq(){
    var _this = this;
    wx.getSetting({
      success(res){
        if(res.authSetting['scope.userInfo']){
          _this.isLogin(_this.getUserNum());
          _this.getUserIcon()
        }else{
          wx.navigateTo({
            url:"/pages/login/login"
          })
        }
      }
    })
  },
  isLogin(obj) {
    wx.showNavigationBarLoading()
    var sessionID = wx.getStorageSync('sessionID');
    console.log(sessionID)
    var timestamp = wx.getStorageSync('timestamp');
    var currenstamp = Date.parse(new Date());
    var _this = this;
    function codeback(sessionID) {
      try{
        wx.request({
          header: {
            // cookie: "JSESSIONID=" + sessionID + ";domain=www.victorzuo.top;path=/wx"
            cookie: "JSESSIONID=" + sessionID + ";domain=localhost;path=/wx"
          },
          url: obj.url,
          data: obj.data,
          method: obj.method || 'get',
          success: function (res) {
            var data = res.data
            if(data.static && data.static==0){
              _this.requestFail()
              return
            }
            if((typeof data)=='string'){
              data = data.replace(/'/g, '"')
              data = JSON.parse(data).data==undefined ? JSON.parse(data) :JSON.parse(data).data
            }
            obj.success(data) || function(){}
            wx.hideNavigationBarLoading()
          },
          fail:function(){
            _this.requestFail()
          }
        })
      }catch (e) {}
    }

    if (sessionID && (currenstamp - timestamp) < this.globalData.intervalTime) {
      console.log('未过期')
      this.getUserInfo()
      if(obj){
        codeback(sessionID)
      }
    }
    else if (sessionID == '' || (currenstamp - timestamp) >= this.globalData.intervalTime) {
      console.log('已过期')
      this.doLogin(codeback);
    }
  },
  getUserInfo(){
    var _this = this;
    wx.getUserInfo({
      success(res){
        _this.globalData.userInfo = res.userInfo;
      }
    })
  },
  doLogin(codeback){
    var _this = this;
    wx.login({
      success:function(res){
        if(res.code){
          wx.request({
            url:_this.globalData.ip+'/auth',
            data:{
              code:res.code
            },
            success:function(res){
              var data = res.data.replace(/'/g,'"');
              var _data = JSON.parse(data);
              if(_data.static==1){
                let value = res.header['Set-Cookie'].split(';')[0].split('=')[1]
                wx.setStorageSync('sessionID', value);
                var timestamp = Date.parse(new Date())
                wx.setStorageSync('timestamp',timestamp)
                codeback(value);
                _this.getUserInfo();
              }else{
                _this.requestFail()
              }
            }
          })
        }
      }
    })
  },
  getUserIcon:function(){
    let icons = [[],[]]
    let icon
    let obj = {
      url:this.globalData.ip+'/getIcon',
      success:function(res){
        icon = res
        this.globalData._userIcon = res
        for(let i=0;i<icon.length;i++){
          let deal = this.dealLabel(icon[i])
          icons[deal.type].push(deal.obj)
        }
        this.globalData.userIcon = icons
      }.bind(this)
    }
    this.isLogin(obj)
  },
  getUserNum:function(){
    let obj = {
      url:this.globalData.ip+'/info',
      success:function(res) {
        this.globalData.userNum = res
        this.getBadge()
      }.bind(this)
    }
    return obj
  },
  dealLabel:function(icon){
    let aicon = icon.label.split('-')
    let type = 0
    if(aicon[2]=='#i'){
      type = 1
    }
    let obj = {
      type:aicon[0],
      index:aicon[1],
      name:icon.name,
      label:icon.label
    }
    return {type:type,obj:obj}
  },
  yanz:function(x,y){
    if(x===''){
      wx.showToast({
        title: y,
        duration: 1000,
        icon:"none"
      })
      return 0
    }
    return 1
  },
  onShareAppMessage:function(options){
    console.log(options)
  },
  getBadge:function(){
    let obj = {
      url:this.globalData.ip +'/getBadge',
      method:'get',
      success:function(res){
        this.globalData.badge = res
      }.bind(this)
    }
    this.isLogin(obj)
  }
})
