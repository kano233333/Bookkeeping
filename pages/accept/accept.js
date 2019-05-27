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
    let obj = {
      url:app.globalData.ip + '/isJoin',
      data:{
        isJoin:select,
        tid:this.data.team.tid,
        tname:this.data.team.tname,
        name:app.globalData.userInfo.nickName
      },
      success:function(res){
        console.log(res)
        wx.switchTab({
          url:'/pages/team/team'
        })
      }
    }
    app.isLogin(obj)
  }
})