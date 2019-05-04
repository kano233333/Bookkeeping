
var app = getApp()
Page({
  data: {
    userData:{},
    balance:0,
    totalAccount:0
  },
  onLoad: function (options) {
    this.setTabBar(4)
    this.setData({
      userData:app.globalData.userInfo
    })
    app.isLogin(this.getUser.bind(this))
  },
  setTabBar(index){
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: index
      })
    }
  },
  getUser(sessionID){
    let _this = this
    wx.request({
      header: {
        cookie: "JSESSIONID=" + sessionID + ";domain=localhost;path=/wx"
      },
      url:app.globalData.ip+'/info',
      success:function(res) {
        _this.setData({
          balance:res.balance,
          totalAccount:res.totalAccount
        })
      }
    })
  }
})