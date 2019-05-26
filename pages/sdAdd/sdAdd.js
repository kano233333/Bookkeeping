let calCommonExp = require("../../utils/cal").calCommonExp
const icon = require("../../utils/base64")
let aicon , sicon, _options
let formatTime = require('../../utils/util').formatTime
let app = getApp()
const day = app.globalData.day
const bill = app.globalData.bill
let setIcon = function(){
  sicon = app.globalData.userIcon
  aicon = [[...icon.outcome,...sicon[0]],[...icon.income,...sicon[1]]]
}
let SELECT = [0,0]
let setSwiperIcon = function(type){
  let icon = [],a = 0
  let num = 10
  let b = []
  for(let i=0;i<aicon[type].length;i++){
    b.push(aicon[type][i])
    num--
    if(num==0 || i==aicon[type].length-1){
      icon[a] = b
      a++
      num = 10
      b = []
    }
  }
  return icon
}

Page({
  data: {
    type:0,
    icon:[],
    iconSwiper:[],
    iconAll:icon.all,
    selectIndex:0,
    remarks:'',
    amount:'',
    mode:'',
    selectSrc:'',
    selectText:'',
    current:0,
    isKey:false,
    timePick:formatTime(new Date,'day'),
    smallTime:'',
    calAcmount:''
  },
  onLoad: function (options) {
    _options = options
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
      this.data.icon = aicon[billData.type]
      let iconX = billData.label.split("-")
      let iconAll = this.data.iconAll
      this.data.billData = billData
      let selectText = billData.iconName || iconAll[iconX[0]][iconX[1]].name
      let type = billData.type
      SELECT[type] = this.findIndex(iconX,type)
      this.setData({
        type:billData.type,
        remarks:billData.remarks,
        amount:billData.amount,
        selectSrc:iconAll[iconX[0]][iconX[1]].value,
        selectText:selectText,
        selectIndex: SELECT[type],
        iconSwiper:setSwiperIcon(type),
        timePick:billData.time.split(" ")[0],
        smallTime:billData.time.split(" ")[1]
      })
    }
  },
  shiftType(e){
    let type = e.target.dataset.type
    this.setData({
      type:type,
      iconSwiper:setSwiperIcon(type),
      current:0,
      selectIndex: SELECT[type]
    },()=>{
      this.data.icon = aicon[type]
      this.setSelectIcon(SELECT[type])
    })
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
    SELECT[this.data.type] = index
    this.setData({
      selectIndex:index,
    })
    this.setSelectIcon(index)
  },
  addSubmit(){
    let amount = this.data.amount+''
    if(app.yanz(amount,"请选择输入金额")==0){return}
    let selectIndex = this.data.selectIndex
    if(app.yanz(selectIndex,"请选择图标")==0){return}
    amount = calCommonExp(amount)
    if(amount<0){
      wx.showToast({
        title:'金额表达式金额小于0',
        icon:'none',
        duration: 1000,
      })
      return
    }else if(isNaN(amount)){
      wx.showToast({
        title:'金额表达式错误',
        icon:'none',
        duration: 1000,
      })
      return
    }
    let smallTime = this.data.smallTime || formatTime(new Date,"detail").split(" ")[1]
    let icon = this.data.icon
    let label = icon[selectIndex].label || icon[selectIndex].type+"-"+icon[selectIndex].index
    let obj = {
      type:this.data.type,
      amount:amount,
      label:label,
      time:this.data.timePick+" "+smallTime,
      remarks:this.data.remarks
    }
    if(this.data.mode=='edit'){
      obj.bid = this.data.billData.bid
    }

    if(_options.isTeam==1){
      this.addTeamBill(obj)
      return
    }

    let reqObj = {
      url:app.globalData.ip+'/'+this.data.mode+'Bill',
      method:'get',
      data:obj,
      success:function(res){
        var _data = res;
        var isGet = ''
        if(_data.static==1){
          if(this.data.mode=='add'){
            app.globalData.userNum.totalAccount++
            let index = bill.indexOf(app.globalData.userNum.totalAccount)
            let num = app.globalData.badge.bill.split('g')[1] || 0
            if(index!=-1 && bill[index]>num){
              isGet = 'bg'+bill[index]
              this.userBadge({type:'bill',badge:'bg'+bill[index]})
            }
            if(res.isSignIn){
              app.globalData.userNum.signInDays++
              let index = day.indexOf(app.globalData.userNum.signInDays)
              let num = app.globalData.badge.day.split('g')[1] || 0
              if(index!=-1 && day[index]>num){
                isGet = 'dg'+day[index]
                this.userBadge({type:'day',badge:'dg'+day[index]})
              }
            }
          }
          wx.showToast({
            title: '成功',
            duration: 1000,
            icon:"none"
          })
          let P = new Promise((res,req)=>{
            app.globalData.badgeGet = isGet
            app.globalData.billIsChange = 1
            app.globalData.chartIsChange = 1
            setTimeout(function(){
              wx.switchTab({
                url:'/pages/index/index',
                success:function(e){
                  res('ok')
                }
              })
            },500)
          })
        }
      }.bind(this)
    }
    app.isLogin(reqObj)
  },
  userBadge:function(badge){
    let obj = {
      url:app.globalData.ip +'/addBadge',
      data:badge,
      method:'get',
      success:function(res) {
        console.log(res)
      }
    }
    app.isLogin(obj)
  },
  setRemarks:function(e){
    let value = e.detail.value
    this.data.remarks = value
  },
  setAmount:function(){
    var arr = ["+","-","*","/","."]
    var amount = this.data.amount
    if(arr.indexOf(amount[amount.length-1])!==-1){
      amount = amount.substring(0,amount.length-1)
    }
    this.setData({
      isKey:!this.data.isKey,
      amount:amount,
    })
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
  },
  setValue:function(e){
    let value = e.detail.value
    let calAcmount = isNaN(calCommonExp(value)) ? 0 : calCommonExp(value)
    this.setData({
      amount:value,
      calAcmount: " (="+calAcmount+")"
    })
  },
  pickerEvent:function(e){
    this.setData({
      timePick:e.detail.timeData
    })
  },
  addTeamBill:function(obj){
    obj.tid = _options.tid
    if(_options.mode == 'edit'){
      obj.bid = JSON.parse(_options.billData).bid
      obj.nickName = JSON.parse(_options.billData).nickName
      let _obj = {
        url:app.globalData.ip + '/editTeamBill',
        data:obj,
        success:function(res){
          if(res.static==1){
            obj.isSelf = 1
            app.team = {
              type:'edit',
              data:obj
            }
          }else{
            wx.showToast({
              title:'失败',
              icon:'none',
              duration:1000
            })
          }
          wx.navigateBack({
            delta:1
          })
        }
      }
      app.isLogin(_obj)
    }else{
      obj.nickName = app.globalData.userInfo.nickName
      let _request = {
        url:app.globalData.ip+'/addTeamBill',
        data:obj,
        success:function(res){
          obj.bid = res.bid
          obj.isSelf = 1
          app.team = {
            type:_options.mode || 'add',
            data:obj
          }
          wx.navigateBack({
            delta:1
          })
        }
      }
      app.isLogin(_request)
    }
  }
})