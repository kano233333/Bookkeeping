//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    islogin:false
  },
  onLoad: function () {
    // app.isSq();
    this.setTabBar(0)
  },
  getPickerTimer(data){
    console.log(data)
  },
  setTabBar(index){
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: index
      })
    }
  }
})
