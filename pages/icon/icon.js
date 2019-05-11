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
    let date = (new Date()).valueOf() +''
    let subObj = {
      url:app.globalData.ip+'/iconOperation',
      data:{
        name:this.data.inputVal,
        label:this.data.selectStr+'-'+this.data.type+"-"+date.substring(date.length-4,date.length),
        operation:"set"
      },
      success:function(res){
        console.log(res)
      }
    }
    let icon = []
    icon = wx.getStorageSync("icon")
    console.log(icon)
    icon.push({
      name:this.data.inputVal,
      label:this.data.selectStr+'-'+this.data.type
    })
    wx.setStorageSync('icon',icon)
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
  }
})