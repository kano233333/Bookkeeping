let app = getApp()
Page({
  data: {
    styleStr:'',
    teams:[],
    page:1,
    setName:'',
    isEmpty:false
  },
  onLoad: function (options) {
    this.onShow()
  },
  hideAdd:function(){
    this.setData({
      styleStr:''
    })
  },
  showAdd(){
    this.setData({
      styleStr:'width:84vw;height:auto;border-radius:5px;background:#fff;'
    })
  },
  getTeams:function(){
    let obj = {
      url:app.globalData.ip+'/getTeam',
      data:{
        page:this.data.page
      },
      success:function(res){
        let isEmpty = false
        if(res.length==0){
          isEmpty = true
        }
        this.setData({
          teams:res,
          isEmpty:isEmpty
        })
      }.bind(this)
    }
    app.isLogin(obj)
  },
  onShow:function(){
    this.getTeams()
  },
  onReachBottom:function(){
    this.data.page++
  },
  setTeam:function(){
    let teams = this.data.teams

    let obj = {
      url: app.globalData.ip + '/setTeam',
      data: {
        tname: this.data.setName,
        uname:app.globalData.userInfo.nickName
      },
      success: function (res) {
        let _this = this
        teams.push({
          name: this.data.setName,
          tid:res.tid,
          isAdministrator:1
        })
        this.setData({
          teams:teams,
          setName:'',
          styleStr:''
        },()=>{
          _this.hideAdd()  //btn上bindtap有事件
        })
      }.bind(this)
    }
    app.isLogin(obj)
  },
  setTeamName:function(e){
    this.data.setName = e.detail.value
  }
})