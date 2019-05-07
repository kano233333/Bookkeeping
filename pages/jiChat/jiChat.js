
var app = getApp()
Page({
  data: {

  },
  onLoad: function (options) {
    this.setTabBar(1)
  },
  setTabBar(index){
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: index
      })
    }
  }
})