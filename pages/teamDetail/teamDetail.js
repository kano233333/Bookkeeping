const aaa = {
  bill:[
    {
      amount: 5,
      bid: "209",
      label: "medical-0",
      remarks: "",
      time: "2019-05-22 14:29:00.0",
      type: "0",
      isSelf:1,
      nickName:'aaa'
    },
    {
      amount: 5,
      bid: "209",
      label: "medical-0",
      remarks: "",
      time: "2019-05-22 14:29:00.0",
      type: "0",
      isSelf:0,
      nickName:'aaa'
    }
  ],
  member:[
    {nickName:'aaa',uid:'0',isAdministrator:1},
    {nickName:'aaa',uid:'0',isAdministrator:0},
    {nickName:'aaa',uid:'0',isAdministrator:0},
    {nickName:'aaa',uid:'0',isAdministrator:0}
  ],
  notice:[
    {name:'aaa',event:3,label:'funny_1',amount:111,operationTime:'2019-1-1'},
    {name:'bbb',event:4,label:'funny_1',amount:111,operationTime:'2019-1-1'},
    {name:'aaa',event:5,label:'funny_1',amount:111,operationTime:'2019-1-1'},
    {name:'ccc',event:0,operationTime:'2019-1-1'},
    {operator:'ccc',name:'ddd',event:2,operationTime:'2019-1-1'},
    {name:'ccc',event:1,operationTime:'2019-1-1'}
  ]
}
const typeTo = ['bill','member','notice']
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
    page:[0,0,0],
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
    this.getData('bill')
  },
  onShow:function(){
    let _this = this
    if(app.team){
      console.log(app.team)
      this.refreshList('bill',app.team.type,app.team.data)
    }
  },
  shiftType(e) {
    let btype = this.data.type
    let type = e.target.dataset.type
    if(this.data.isfirst[type]){
      this.getData(typeTo[type])
      this.data.isfirst[type] = false
    }
    this.setData({
      type: type,
    })
  },
  onShareAppMessage(res){
    let info = {
      title:'邀请加入',
      path:'/pages/accept/accept?tid=12&useName='+app.globalData.userInfo.nickName+'&tname='+this.data.teamData.name
    }
    return info
  },
  getData:function(type){
    let obj = {
      url:'',
      data:{
        tid:'',
        page:this.data.page[this.data.type]
      },
      success:function(res){
        let arr = this.data[type]
        arr = [...arr,...res]
        // switch(type){
        //   case 'bill':
        //     this.setData({
        //       bill:arr
        //     })
        //     break;
        //   case 'member':
        //     this.setData({
        //       member:arr
        //     })
        //     break;
        //   case 'notice':
        //     break;
        // }

        this.setData({
          [type]:arr
        })
      }.bind(this)
    }
    this.setData({
      [type]:aaa[type]
    })
  },
  onReachBottom:function(){
    let type = this.data.type
    this.data.page[type]++
    this.getData(typeTo[type])
  },
  deleteMember:function(e){
    let uid = e.target.dataset.uid
    let index = e.target.dataset.index
    let obj =  {
      url:'',
      data:{
        uid:'',
        tid:this.data.teamData.tid
      },
      success:function(){}
    }
    this.data.member.splice(index,1)
    this.setData({
      member:this.data.member
    })
  },
  refreshList:function(dataType,type,dataX){
    if(typeof dataType == "object" && dataType.detail){
      type = dataType.detail.type
      dataX = dataType.detail.type
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
  }
})