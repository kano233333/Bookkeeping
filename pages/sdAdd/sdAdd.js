// pages/sdAdd/sdAdd.js
const icon = require("../../utils/base64")
let aicon = [icon.outcome,icon.income]
let sicon = wx.getStorageSync('icon')
let formatTime = require('../../utils/util').formatTime
let app = getApp()
let setIcon = function(){
  for(let i=0;i<sicon.length;i++){
    let sp = sicon[i].label.split('-')
    let type = 0
    if(sp[2]=='#i'){
      type = 1
    }
    aicon[type].push({type:sp[0],index:sp[1],name:sicon[i].name,from:sp[2]})
  }
}
setIcon()
Page({
  data: {
    type:0,
    icon:aicon[0],
    iconAll:icon.all,
    selectIndex:'',
    remarks:'',
    amount:'',
    mode:'',
    selectSrc:'',
    selectText:''
  },
  onLoad: function (options) {
    sicon = wx.getStorageSync('icon')
    setIcon()
    this.setData({
      icon:aicon[0]
    })
    this.data.type = options.type || 0
    this.data.mode = options.mode || 'add'
    if(this.data.mode=='edit'){
      let billData = JSON.parse(options.billData)
      let iconX = billData.label.split("-")
      let iconAll = this.data.iconAll
      this.data.billData = billData
      this.setData({
        type:billData.type,
        remarks:billData.remarks,
        amount:billData.amount,
        selectSrc:iconAll[iconX[0]][iconX[1]].value,
        selectText:iconAll[iconX[0]][iconX[1]].name,
        selectIndex:this.findIndex(iconX,billData.type)
      })
    }
  },
  shiftType(e){
    let type = e.target.dataset.type
    this.setData({
      type:type,
      icon:aicon[type],
    })
    console.log(aicon[type])
    console.log(aicon[type][0].name)
  },
  selectIcon(e){
    let index = e.currentTarget.dataset.index
    let iconc = this.data.icon
    this.setData({
      selectIndex:index,
      selectSrc:icon.all[iconc[index].type][iconc[index].index].value,
      selectText:icon.all[iconc[index].type][iconc[index].index].name,
    })
  },
  addSubmit(){
    let selectIndex = this.data.selectIndex
    let icon = this.data.icon
    let label = icon[selectIndex].type+"-"+icon[selectIndex].index
    if(icon[selectIndex].from!=undefined){
      label = label+"-"+icon[selectIndex].from
    }
    let obj = {
      type:this.data.type,
      amount:this.data.amount,
      label:label,
      time:formatTime(new Date,"detail"),
      remarks:this.data.remarks
    }
    if(this.data.mode=='edit'){
      obj.time = this.data.billData.time
      obj.bid = this.data.billData.bid
    }
    let reqObj = {
      url:app.globalData.ip+'/'+this.data.mode+'Bill',
      method:'get',
      data:obj,
      success:function(res){
        var _data = res;
        if(_data.static==1){
          wx.showToast({
            title: '成功',
            duration: 1000,
            icon:"none"
          })
          let P = new Promise((res,req)=>{
            setTimeout(function(){
              wx.switchTab({
                url:'/pages/index/index',
                success:function(e){
                  res('ok')
                }
              })
            },500)
          }).then(()=>{
            var page = getCurrentPages()[0]
            page.onLoad()
          })
        }
      }.bind(this)
    }
     app.isLogin(reqObj)
  },
  setRemarks:function(e){
    let value = e.detail.value
    this.data.remarks = value
  },
  setAmount:function(e){
    let value = e.detail.value
    this.data.amount = value
  },
  findIndex:function(iconX,type){
    for(let i=0;i<icon.outcome.length;i++){
      if(aicon[type][i].type==iconX[0] && aicon[type][i].index==iconX[1]){
        if(iconX.length==2){
          return i
        }else if(iconX.length==3 && aicon[type][i].from!=undefined){
          return i
        }
      }
    }
  }
})