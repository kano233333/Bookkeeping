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
    var timestamp = wx.getStorageSync('timestamp');
    var currenstamp = Date.parse(new Date());
    console.log(currenstamp-timestamp)
    var _this = this;

    if(sessionID && (currenstamp-timestamp)<app.globalData.intervalTime){
      console.log('未过期')
      wx.request({
        url:_this.globalData.ip+'/userLogin',
        data:{
          uuid:sessionID
        }
      }).then((res)=>{
        if(res.state==1) {
          _this.getUserInfo();
        }
      }).catch(()=>{})
    }else if(sessionID && (currenstamp-timestamp)>=app.globalData.intervalTime){
      console.log('已过期')
      this.doLogin();
    }else{
      this.setData({
        islogin:false
      })
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
    wx.login({
      success:function(res){
        if(res.code){
          wx.request({
            url:app.globalData.ip+'/userLogin',
            header:{
              'cookie':res.code
            }
          }).then((res)=>{
            wx.setStorageSync('sessionID', res.sessionID);
            var timestamp = Date.parse(new Date())
            wx.setStorageSync('timestamp',timestamp)
            _this.getUserInfo();
          }).catch((err)=>{})
        }
      }
    })
  }
})
