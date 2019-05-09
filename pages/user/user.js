
var app = getApp()
Page({
  data: {
    userData:{},
    balance:0,
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
          balance:res.balance,
          totalAccount:res.totalAccount
        })
      }.bind(this)
    }
    app.isLogin(obj)
  }
})