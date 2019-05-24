Page({
  data: {
    styleStr:'',
    teams:''
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
      url:'',
      success:function(res){

      }
    }

    this.setData({
      teams:[
        {tid:'12',name:'aaa',isAdministrator:0},
        {tid:'12',name:'bbb',isAdministrator:0},
        {tid:'12',name:'ccc',isAdministrator:1},
        {tid:'12',name:'ddd',isAdministrator:1},
        {tid:'12',name:'eee',isAdministrator:0},
        {tid:'12',name:'fff',isAdministrator:1},
        {tid:'12',name:'aaa',isAdministrator:0},
        {tid:'12',name:'aaa',isAdministrator:1},
        {tid:'12',name:'aaa',isAdministrator:0},
        {tid:'12',name:'aaa',isAdministrator:0}
      ]
    })
  }
})