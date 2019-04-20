//app.js
App({
  onLaunch: function () {

  },
  globalData: {
    userInfo: null,
    userStatus:'',
    ip:'http://192.168.1.70:8080/wx',
    intervalTime:60000
  },
  requestFail:function(){
    wx.showToast({
      title: '错误',
      duration: 1000,
      icon:"none"
    })
  },
  aaa:function(a){
    console.log(a)
  }
})
