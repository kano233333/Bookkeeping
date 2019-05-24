let app = getApp()
Page({
  data: {
    isUserInfo:false,
    team:{}
  },
  onLoad:function(options){
    console.log(options)
    let _this = this
    app.isSq().then(res=>{
      this.setData({
        isUserInfo:!res.isLogin,
        team:options
      })
    })
  },
  userLogin:function(){
    let _this = this
    this.setData({
      isUserInfo:false
    })
  },
  selectJoin:function (e) {
    let select = e.target.dataset.accept
    wx.switchTab({
      url:'/pages/team/team'
    })
  }
})