
var app = getApp()
Page({
  hideAdd:function(){
    var pages=getCurrentPages()[0]
    var path = "/"+pages.__displayReporter.showReferpagepath.split('.')[0]
    wx.switchTab({
      url:path
    })
  }
})