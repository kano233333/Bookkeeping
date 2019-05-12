// pages/sdAdd/sdAdd.js
const icon = require("../../utils/base64")
let aicon , sicon
let formatTime = require('../../utils/util').formatTime
let app = getApp()
let setIcon = function(){
  sicon = app.globalData.userIcon
  aicon = [[...icon.outcome,...sicon[0]],[...icon.income,...sicon[1]]]
}
let setSwiperIcon = function(type){
  let icon = [],a = 0
  let num = 15
  let b = []
  for(let i=0;i<aicon[type].length;i++){
    b.push(aicon[type][i])
    num--
    if(num==0 || i==aicon[type].length-1){
      icon[a] = b
      a++
      num = 15
      b = []
    }
  }
  console.log(icon)
  return icon
}

Page({
  data: {
    type:0,
    icon:[],
    iconAll:icon.all,
    selectIndex:0,
    remarks:'',
    amount:'',
    mode:'',
    selectSrc:'',
    selectText:'',
    current:0
  },
  onLoad: function (options) {
    setIcon()
    let icon = setSwiperIcon(0)
    this.data.icon = aicon[0]
    this.setData({
      iconSwiper:icon
    })
    this.setSelectIcon(0)
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
        iconSwiper:setSwiperIcon(billData.type)
      })
    }
  },
  shiftType(e){
    let type = e.target.dataset.type
    this.setData({
      type:type,
      iconSwiper:setSwiperIcon(type),
      current:0
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
    let amount = this.data.amount
    if(app.yanz(amount,"请选择输入金额")==0){return}
    let selectIndex = this.data.selectIndex
    if(app.yanz(selectIndex,"请选择图标")==0){return}
    let icon = this.data.icon
    let label = icon[selectIndex].label || icon[selectIndex].type+"-"+icon[selectIndex].index
    let obj = {
      type:this.data.type,
      amount:amount,
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
          if(this.data.mode=='add'){
            app.globalData.userNum.totalAccount++
            if(res.isSign){
              app.globalData.userNum.signInDays++
            }
          }
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
    for(let i=0;i<aicon[type].length;i++){
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