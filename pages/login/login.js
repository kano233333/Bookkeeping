const app = getApp()

Page({
  data: {},
  bindgetuserinfo:function(){
    app.getUserInfo();
    wx.switchTab({
      url:'/pages/index/index'
    })
  }
})