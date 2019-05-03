
var app = getApp()
Page({
  data: {
    userData:app.globalData
  },
  onLoad: function (options) {
    this.setTabBar(4)
    console.log(this.data.userData)
  },
  setTabBar(index){
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: index
      })
    }
  }
})