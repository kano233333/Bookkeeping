//app.js
App({
  onLaunch: function () {

  },
  globalData: {
    userInfo: null,
    userStatus:'',
    ip:'http://192.168.1.70:8080/wx',
    intervalTime:60000
  },
  requestFail:function(xxx){
    console.log(xxx)
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
          _this.isLogin(_this.getUserInfo);
        }else{
          wx.navigateTo({
            url:"/pages/login/login"
          })
        }
      }
    })
  },
  isLogin(codeback) {
    var sessionID = wx.getStorageSync('sessionID');
    console.log(sessionID)
    var timestamp = wx.getStorageSync('timestamp');
    var currenstamp = Date.parse(new Date());
    console.log(currenstamp - timestamp)
    var _this = this;

    if (sessionID && (currenstamp - timestamp) < this.globalData.intervalTime) {
      console.log('未过期')
      wx.request({
        url: this.globalData.ip + '/auth',
        header: {
          cookie: "JSESSIONID=" + sessionID + ";domain=localhost;path=/wx"
        },
        success: function (res) {
          console.log(res)
          var data = res.data.replace(/'/g, '"');
          var _data = JSON.parse(data);
          if (_data.static == 1) {
            codeback(sessionID);
          }
        }
      })
    } else if (sessionID == '' || (currenstamp - timestamp) >= this.globalData.intervalTime) {
      console.log('已过期')
      this.doLogin();
    }
  }
  ,
  getUserInfo(){
    var _this = this;
    wx.getUserInfo({
      success(res){
        _this.globalData.userInfo = res.userInfo;
        console.log(res)
      }
    })
  },
  doLogin(){
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
              console.log(res)
              var data = res.data.replace(/'/g,'"');
              var _data = JSON.parse(data);
              if(_data.static==1){
                console.log(res.cookies[0].value)
                wx.setStorageSync('sessionID', res.cookies[0].value);
                var timestamp = Date.parse(new Date())
                wx.setStorageSync('timestamp',timestamp)
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
//  -------------------------
})
