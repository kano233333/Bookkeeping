const app = getApp()

Page({
  data: {},
  bindgetuserinfo:function(){
    app.doLogin();
    wx.navigateTo({
      url:'/pages/index/index'
    })
  }
})