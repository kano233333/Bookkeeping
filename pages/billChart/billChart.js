
var app = getApp()
Page({
  data: {
    type:0,
    type2:0
  },
  onLoad: function (options) {
    this.setTabBar(3)
  },
  setTabBar(index){
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: index
      })
    }
  },
  shiftType(e){
    let type = e.target.dataset.type
    this.setData({
      type:type
    })
  },
  shiftType2(e){
    let type = e.target.dataset.type
    this.setData({
      type2:type
    })
  }
})