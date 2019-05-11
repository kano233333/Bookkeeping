const app = getApp()

Page({
  data: {},
  bindgetuserinfo:function(){
    app.doLogin();
    wx.switchTab({
      url:'/pages/index/index'
    })
  }
})