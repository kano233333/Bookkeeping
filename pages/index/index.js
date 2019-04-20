//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    islogin:true
  },
  onLoad: function () {
    this.isSq();
  },
  getPickerTimer(data){
    console.log(data)
  },
  isSq(){
    var _this = this;
    wx.getSetting({
      success(res){
        if(res.authSetting['scope.userInfo']){
          _this.isLogin();
        } else {
          _this.setData({
            islogin:false
          })
        }
      }
    })
  },
  isLogin(){
    var sessionID = wx.getStorageSync('sessionID');
    console.log(sessionID)
    var timestamp = wx.getStorageSync('timestamp');
    var currenstamp = Date.parse(new Date());
    console.log(currenstamp-timestamp)
    var _this = this;

    if(sessionID && (currenstamp-timestamp)<app.globalData.intervalTime){
      console.log('未过期')
      wx.request({
        url:app.globalData.ip+'/auth',
        header:{
          cookie: "JSESSIONID="+sessionID+";domain=localhost;path=/wx"
        },
        success:function(res){
          console.log(res)
          var data = res.data.replace(/'/g,'"');
          var _data = JSON.parse(data);
          if(_data.static==1){
            _this.getUserInfo();
          }
        }
      })
    }else if((currenstamp-timestamp)>=app.globalData.intervalTime){
      console.log('已过期')
      this.doLogin();
    }else if(sessionID==''){
      this.doLogin();
    }
  },
  getUserInfo(){
    var _this = this;
    wx.getUserInfo({
      success(res){
        app.globalData.userInfo = res.userInfo;
        console.log(res)
        _this.setData({
          islogin:true,
          motto:'Hello '+app.globalData.userInfo.nickName
        })
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
            url:app.globalData.ip+'/auth',
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
                app.requestFail()
              }
            }
          })
        }
      }
    })
  }
})
