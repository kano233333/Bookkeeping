//app.js
App({
  onLaunch: function () {
    this.getUserIcon()
  },
  globalData: {
    userInfo: null,
    userStatus:'',
    // ip:'https://www.victorzuo.top/wx',
    ip:'http://192.168.1.70:8080/wx/',
    intervalTime:60000
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
          console.log(res)
          _this.isLogin();
        }else{
          wx.navigateTo({
            url:"/pages/login/login"
          })
        }
      }
    })
  },
  isLogin(obj) {
    var sessionID = wx.getStorageSync('sessionID');
    console.log(sessionID)
    var timestamp = wx.getStorageSync('timestamp');
    var currenstamp = Date.parse(new Date());
    var _this = this;
    function codeback(sessionID) {
      wx.request({
        header: {
          // cookie: "JSESSIONID=" + sessionID + ";domain=victorzuo.com;path=/wx"
          cookie: "JSESSIONID=" + sessionID + ";domain=localhost;path=/wx"
        },
        url: obj.url,
        data: obj.data,
        method: obj.method | 'get',
        success: function (res) {
          var data = res.data
          if((typeof data)=='string'){
            data = data.replace(/'/g, '"')
            data = JSON.parse(data).data==undefined ? JSON.parse(data) :JSON.parse(data).data
          }
          obj.success(data)
        }
      })
    }

    if (sessionID && (currenstamp - timestamp) < this.globalData.intervalTime) {
      console.log('未过期')
      if(obj){
        codeback(sessionID)
      }
      this.getUserInfo()
    }
    else if (sessionID == '' || (currenstamp - timestamp) >= this.globalData.intervalTime) {
      console.log('已过期')
      this.doLogin(codeback);
    }
  }
  ,
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
    console.log('login')
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
                let value = (typeof res.cookies[0])=="object" ? res.cookies[0].value : res.cookies[0].split(';')[0].split('=')[1]
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
        for(let i=0;i<icon.length;i++){
          let deal = this.dealLabel(icon[i])
          icons[deal.type].push(deal.obj)
        }
        this.globalData.userIcon = icons
      }.bind(this)
    }
    this.isLogin(obj)
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
  }
})
