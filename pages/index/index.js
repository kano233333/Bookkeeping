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
    var _this = this;
    if(sessionID){
      // wx.request({
      //   url:_this.globalData.ip+'/userLogin',
      //   data:{
      //     uuid:sessionID
      //   }
      // }).then((res)=>{
      //   if(res.state==1) {
      _this.getUserInfo();
      // }
      // }).catch(()=>{})
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
  loginModel(){
    this.setData({
      islogin:true,
      motto:'Hello '+app.globalData.userInfo.nickName
    })
  }
})
