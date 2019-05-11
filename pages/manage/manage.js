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
    this.getIcon()
  },
  shiftType(e){
    let type = e.target.dataset.type
    this.setData({
      type:type,
      icons:this.data.aicons[type],
      length:this.data.aicons[type].length
    })
  },
  addIcon(){
    wx.navigateTo({
      url:'/pages/icon/icon?type='+this.data.type
    })
  },
  getIcon:function(){
    let icons = [[],[]]
    let icon
    console.log(icon)
    let obj = {
      url:app.globalData.ip+'/getIcon',
      success:function(res){
        icon = res
        for(let i=0;i<icon.length;i++){
          let aicon = icon[i].label.split('-')
          let type = 0
          if(aicon[2]=='#i'){
            type = 1
          }
          icons[type].push({
            type:aicon[0],
            index:aicon[1],
            name:icon[i].name,
            label:icon[i].label,
            localIndex:i
          })
        }
        this.data.aicons = icons
        this.setData({
          icons:icons[this.data.type],
          length:icons[this.data.type].length
        })
      }.bind(this)
    }
    app.isLogin(obj)
  },
  deleteShow:function(e){
    let obj = {
      url:app.globalData.ip+"/iconOperation",
      data:{
        label:e.target.dataset.label,
        operation:'delete'
      },
      success:function(res){
        console.log(res)
      }
    }
    app.isLogin(obj)
  }
})