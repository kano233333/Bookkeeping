const typeTo = ['bill','member','notice']
const urlTo = {bill:'/getTeamBill',member:'/getTeamMember',notice:'/getInfo'}
const app = getApp()
const noticeEvent = {
  '0':{
    event:'加入',
    icon:'/static/icon/join.svg'
  },
  '1':{
    event:'退出',
    icon:'/static/icon/out.svg'
  },
  '2':{
    event:'移除',
    icon:'/static/icon/tc.svg'
  },
  '3':{
    event:'编辑了一条账单',
    icon:'/static/icon/bj.svg'
  },
  '4':{
    event:'添加了一条账单',
    icon:'/static/icon/add.svg'
  },
  '5':{
    event:'删除了一条账单',
    icon:'/static/icon/sc.svg'
  }
}
Page({
  data: {
    type: 0,
    teamData:{},
    page:[1,1,1],
    bill:[],
    member:[],
    notice:[],
    isfirst:[true,true,true],
    isrefresh:true,
    styleStr:'',
    isEnd:[false,false,false],
    noticeEvent:noticeEvent
  },
  onLoad: function (options) {
    this.setData({
      teamData:options
    })
    this.data.isfirst[0] = false
    this.getData('bill',1)
  },
  onShow:function(){
    let _this = this
    if(app.team){
      this.refreshList('bill',app.team.type,app.team.data)
      app.team = {}
    }
  },
  shiftType(e) {
    let btype = this.data.type
    let type = e.target.dataset.type
    let _this = this
    this.setData({
      type: type,
    },()=>{
      if(_this.data.isfirst[type]){
        _this.getData(typeTo[type])
        _this.data.isfirst[type] = false
      }
    })
  },
  onShareAppMessage(res){
    let info = {
      title:'邀请加入',
      path:'/pages/accept/accept?tid=12&useName='+app.globalData.userInfo.nickName+'&tname='+this.data.teamData.name+'&tid='+this.data.teamData.tid
    }
    return info
  },
  getData:function(type,aaa){
    let obj = {
      url:app.globalData.ip + urlTo[type],
      data:{
        tid:this.data.teamData.tid,
        page:this.data.page[this.data.type]
      },
      success:function(res){
        if(aaa){
          this.setData({
            [type]:res
          },)
          return
        }
        if(res.length<10){
          this.data.isEnd[this.data.type] = true
        }
        let arr = this.data[type]
        if(type=='notice'){
          for(let i=0;i<res.length;i++){
            arr.push(JSON.parse(res[i]))
          }
        }else{
          arr = [...arr,...res]
        }
        this.setData({
          [type]:arr
        })
      }.bind(this)
    }
    app.isLogin(obj)
  },
  onReachBottom:function(){
    let type = this.data.type
    if(this.data.isEnd[type]){
      return
    }
    this.data.page[type]++
    this.getData(typeTo[type])
  },
  deleteMember:function(e){
    let uid = e.currentTarget.dataset.uid
    let index = e.currentTarget.dataset.index
    let nickName = e.currentTarget.dataset.nickName
    console.log(e)
    let obj =  {
      url:app.globalData.ip + '/leaveTeam',
      data:{
        operator:app.globalData.userInfo.nickName,
        tid:this.data.teamData.tid,
        name:nickName,
        uid:uid
      },
      success:function(res){
        this.data.member.splice(index,1)
        this.setData({
          member:this.data.member
        })
      }.bind(this)
    }
    app.isLogin(obj)
  },
  refreshList:function(dataType,type,dataX){
    if(typeof dataType == "object" && dataType.detail){
      type = dataType.detail.type
      dataX = dataType.detail.dataX
      dataType = dataType.detail.dataType
    }
    let index = -1
    let data = this.data[dataType]
    let _this = this
    function findIndex(){
      for(let i=0;i<data.length;i++){
        if(data[i].bid == dataX.bid){
          return i
        }
      }
    }
    switch(type){
      case 'add':
        data.push(dataX);
        break;
      case 'edit':
        index = findIndex();
        data[index] = dataX;
        break;
      case 'delete':
        index = findIndex();
        data.splice(index,1);
        break;
    }
    this.setData({
      [dataType]:data,
      isrefresh:false
    },()=>{
      _this.setData({
        isrefresh:true
      })
    })
  },
  showAdd:function(){
    this.setData({
      styleStr:'width:84vw;border-radius:5px;right:8vw;'
    })
  },
  hideAdd:function(){
    this.setData({
      styleStr:''
    })
  },
  tdDetail:function(e){
    console.log(e)
    let data = e.currentTarget.dataset.data
    if(data.event<3){return}
    wx.navigateTo({
      url:'/pages/tbDetail/tbDetail?tname='+this.data.teamData.name+'&billData='+JSON.stringify(data)
    })
  },
  userTeam:function(){
    let obj = {
      url:app.globalData.ip + "/dismissTeam",
      data:{
        tid:this.data.teamData.tid
      },
      success:function(res){
        console.log(res)
        app.isTeamChange = 1
        wx.switchTab({
          url:'/pages/team/team'
        })
      }.bind(this)
    }
    if(this.data.teamData.isAdmin==0){
      obj.url = app.globalData.ip + '/leaveTeam'
      obj.data.name = app.globalData.userInfo.nickName
    }
    app.isLogin(obj)
  },
  onPullDownRefresh(){
    this.refresh()
    wx.stopPullDownRefresh()
  },
  refresh:function(){
    let typeName = typeTo[this.data.type]
    let _this = this
    this.data.page[this.data.type] = 1
    this.setData({
      [typeName]:[]
    },()=>{
      _this.getData(typeName,1)
    })

  }
})