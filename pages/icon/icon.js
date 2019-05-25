const border = ["2px solid #ededed","2px solid #ed6e5d"]
const icon = require('../../utils/base64')
var app = getApp()
Page({
  data: {
    focus:false,
    border:border[0],
    icon:icon,
    selectSrc:'',
    selectStr:'',
    inputVal:''
  },
  onLoad: function (options) {
    this.data.type = options.type==0 ? '#o' : '#i'
  },
  selectIcon:function(e){
    let data  = e.target.dataset
    let selectSrc = icon.all[data.type][data.index].value
    let selectStr = data.type+'-'+data.index
    this.setData({
      selectSrc: selectSrc,
      selectStr: selectStr
    })
  },
  sub:function(){
    let name =  this.data.inputVal
    if(app.yanz(name,'请输入自定义名称')==0){return}
    if(app.yanz(this.data.selectStr,'请选择图标')==0){return}
    let date = (new Date()).valueOf() +''
    let label = this.data.selectStr+'-'+this.data.type+"-"+date.substring(date.length-4,date.length)
    let _icon = {
      label:label,
      name:name
    }
    let subObj = {
      url:app.globalData.ip+'/iconOperation',
      data:{
        name:this.data.inputVal,
        label:label,
        operation:"set"
      },
      success:function(res){
        if(res.static==1){
          this.addLocalIcon(_icon)
          wx.showToast({
            title: '成功',
            duration: 1000,
            icon:"none"
          })
          setTimeout(function(){
            wx.navigateBack({
              delta:1
            })
          },500)
        }
      }.bind(this)
    }
    app.isLogin(subObj)
  },
  shiftBorder:function(e){
    let type = 0
    if(e.type=='focus'){
      type = 1
    }
    this.setData({
      border:border[type]
    })
  },
  getName:function(e){
    this.data.inputVal = e.detail.value
  },
  addLocalIcon:function(label){
    let deal = app.dealLabel(label)
    app.globalData.userIcon[deal.type].push(deal.obj)
  }
})