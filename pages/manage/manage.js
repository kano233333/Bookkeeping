// pages/manage/manage.js
const icon = require('../../utils/base64')
var app = getApp()
Page({
  data: {
    type:0,
    icons:[],
    iconAll:icon.all,
    length:0
  },
  onLoad: function (options) {
    this.setIcon()
  },
  onShow: function (options) {
    this.setIcon()
  },
  shiftType(e){
    let type = e.target.dataset.type
    this.setData({
      type:type,
      icons:this.data.userIcon[type],
      length:this.data.userIcon[type].length
    })
  },
  addIcon(){
    wx.navigateTo({
      url:'/pages/icon/icon?type='+this.data.type
    })
  },
  setIcon:function(){
    this.data.userIcon = app.globalData.userIcon
    let icons = this.data.userIcon
    this.setData({
      icons:icons[this.data.type],
      length:icons[this.data.type].length
    })
  },
  deleteShow:function(e){
    let label = e.target.dataset.label
    let obj = {
      url:app.globalData.ip+"/iconOperation",
      data:{
        label:label,
        operation:'delete'
      },
      success:function(res){
        if(res.static==1){
          // let userIcon = app.globalData.userIcon;
          // for(let i = 0;i<userIcon.length;i++){
          //   if(userIcon[i].label == label){
          //     app.globalData.userIcon = userIcon.split(i,1)
          //     break;
          //   }
          // }
          this.deleteLocalIcon(this.data.type,label)
          wx.showToast({
            title: '成功',
            duration: 1000,
            icon:"none"
          })
          this.setIcon()
        }
      }.bind(this)
    }
    app.isLogin(obj)
  },
  deleteLocalIcon:function(type,label){
    let userIcon = app.globalData.userIcon[type]
    let bindex = -1
    for(let i=0;i<userIcon.length;i++){
      if(userIcon[i].label == label){
        bindex = i
        break;
      }
    }
    if(bindex>-1){
      userIcon.splice(bindex,1)
    }
    app.globalData.userIcon[type] = userIcon
  }
})