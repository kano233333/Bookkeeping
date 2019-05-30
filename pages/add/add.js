
var app = getApp()
Page({
  hideAdd:function(){
    var pages=getCurrentPages()[0]
    var path = "/"+pages.__displayReporter.showReferpagepath.split('.')[0]
    wx.switchTab({
      url:path
    })
  },
  getScancode:function(){
    var _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        var result = res.result;
        console.log(res)
      }
    })
  }
})