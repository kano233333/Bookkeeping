// pages/sdAdd/sdAdd.js
const icon = require("../../utils/base64").icon
let formatTime = require('../../utils/util').formatTime
let app = getApp()
Page({
  data: {
    type:0,
    icon:icon,
    selectIndex:'',
    remarks:'',
    amount:'',
    label:"1",
    mode:''
  },
  onLoad: function (options) {
    this.data.type = options.type || 0
    this.data.mode = options.mode || 'add'
    if(this.data.mode=='edit'){
      let billData = JSON.parse(options.billData)
      this.data.billData = billData
      console.log(billData)
      this.setData({
        type:billData.type,
        selectIndex:Number(billData.label),
        remarks:billData.remarks,
        amount:billData.amount
      })
    }
  },
  shiftType(e){
    let type = e.target.dataset.type
    this.setData({
      type:type
    })
  },
  selectIcon(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      selectIndex:index
    })
  },
  addSubmit(){
    let obj = {
      type:this.data.type,
      amount:this.data.amount,
      label:this.data.selectIndex,
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
                url:'/pages/bill/bill',
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