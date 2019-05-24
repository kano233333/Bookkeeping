const app = getApp()

Page({
  data: {},
  bindgetuserinfo:function(){
    app.isLogin();
    this.triggerEvent('userLogin')
  }
})