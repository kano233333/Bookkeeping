// pages/sdAdd/sdAdd.js
const icon = require("../../utils/base64")
const aicon = [icon.outcome,icon.income]
let formatTime = require('../../utils/util').formatTime
let app = getApp()
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
        selectText:iconAll[iconX[0]][iconX[1]].name
      })
    }
  },
  shiftType(e){
    let type = e.target.dataset.type
    this.setData({
      type:type,
      icon:aicon[type],
    })
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
    let obj = {
      type:this.data.type,
      amount:this.data.amount,
      label:icon[selectIndex].type+"-"+icon[selectIndex].index,
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
  }
})