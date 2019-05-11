// pages/sdAdd/sdAdd.js
const icon = require("../../utils/base64")
let aicon , sicon
let formatTime = require('../../utils/util').formatTime
let app = getApp()
let setIcon = function(){
  sicon = app.globalData.userIcon
  aicon = [[...icon.outcome,...sicon[0]],[...icon.income,...sicon[1]]]
}

Page({
  data: {
    type:0,
    icon:[],
    iconAll:icon.all,
    selectIndex:'',
    remarks:'',
    amount:'',
    mode:'',
    selectSrc:'',
    selectText:''
  },
  onLoad: function (options) {
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
      let selectText = billData.iconName || iconAll[iconX[0]][iconX[1]].name
      this.setData({
        type:billData.type,
        remarks:billData.remarks,
        amount:billData.amount,
        selectSrc:iconAll[iconX[0]][iconX[1]].value,
        selectText:selectText,
        selectIndex:this.findIndex(iconX,billData.type),
        icon:aicon[billData.type]
      })
    }
  },
  shiftType(e){
    let type = e.target.dataset.type
    console.log(icon.all[aicon[1][0].type][aicon[1][0].index].name)
    this.setData({
      type:type,
      icon:aicon[type]
    })
    this.setSelectIcon(this.data.selectIndex)
  },
  setSelectIcon(index){
    try {
      let iconc = this.data.icon
      let selectText = iconc[index].name || icon.all[iconc[index].type][iconc[index].index].name
      this.setData({
        selectSrc:icon.all[iconc[index].type][iconc[index].index].value,
        selectText:selectText,
      })
    }catch (e) {}
  },
  selectIcon(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      selectIndex:index,
    })
    this.setSelectIcon(index)
  },
  addSubmit(){
    let selectIndex = this.data.selectIndex
    let icon = this.data.icon
    let label = icon[selectIndex].label || icon[selectIndex].type+"-"+icon[selectIndex].index
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
    let iconType = 'outcome'
    if(type==0){
      iconType = 'income'
    }
    for(let i=0;i<icon[iconType].length;i++){
      if(aicon[type][i].type==iconX[0] && aicon[type][i].index==iconX[1]){
        if(iconX.length==2){
          return i
        }else if(iconX.length>2 && aicon[type][i].label!=undefined){
          return i
        }
      }
    }
  }
})