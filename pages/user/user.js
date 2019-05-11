
var app = getApp()
Page({
  data: {
    userData:{},
    signInDays:0,
    totalAccount:0
  },
  onLoad: function (options) {
    this.setData({
      userData:app.globalData.userInfo
    })
    this.getUser()
  },
  getUser(){
    let _this = this
    let obj = {
      url:app.globalData.ip+'/info',
      success:function(res) {
        _this.setData({
          signInDays:res.signInDays,
          totalAccount:res.totalAccount
        })
      }.bind(this)
    }
    app.isLogin(obj)
  }
})