
var app = getApp()
Page({
  data: {
    userData:{},
    signInDays:0,
    totalAccount:0
  },
  onLoad: function (options) {
    this.onShow()
  },
  onShow: function (options) {
    this.setData({
      signInDays:app.globalData.userNum.signInDays,
      totalAccount:app.globalData.userNum.totalAccount,
      userData:app.globalData.userInfo
    })
  }
})