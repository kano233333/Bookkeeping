let app = getApp()
Page({
  data: {
    styleStr:'',
    teams:[],
    page:0,
    setName:''
  },
  onLoad: function (options) {
    this.getTeams()
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
      url:app.globalData.ip+'/getTeamBill',
      data:{
        page:this.data.page
      },
      success:function(res){

      }
    }

    this.setData({
      teams:[
        {tid:'12',name:'aaa',isAdministrator:0},
        {tid:'12',name:'bbb',isAdministrator:0},
        {tid:'12',name:'ccc',isAdministrator:1},
        {tid:'12',name:'ddd',isAdministrator:1}
      ]
    })
  },
  onReachBottom:function(){
    this.data.page++
  },
  setTeam:function(){
    let teams = this.data.teams

    let obj = {
      url: app.globalData.ip + '/setTeam',
      data: {
        name: this.data.setName
      },
      success: function (res) {
        console.log(res)
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