//index.js
//获取应用实例
const app = getApp()
const selectH = 6.133
let formatTime = require('../../utils/util').formatTime
const selectPickers = [
  {type:"day",value:"日账"},
  {type:"month",value:"月账"}
]

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    islogin:false,
    billList:[],
    timePick:formatTime(new Date,selectPickers[0].type),
    fields:selectPickers[0].type,
    selectPickers:selectPickers[0],
    reload:true,
    shiftBillBar:true,
    allIncome:0,
    allPay:0
  },
  onLoad: function () {
    console.log('bill onload')
    app.isSq();
    this.getBillList()
  },
  getPickerTimer(data){
    let _this = this
    this.setData({
      timePick:data.detail.timeData
    },()=>{
      _this.getBillList()
    })
  },
  selectPicker(){
    let fields = this.data.selectPickers.type
    let index = fields=='day'?1:0
    let select = selectPickers[index]
    fields = select.type
    let _this = this
    this.setData({
      selectPickers:select,
      fields:fields,
      timePick:formatTime(new Date,fields),
    },()=>{
      _this.getBillList()
    })
  },
  getBillList:function(){
    let _this = this
    let obj = {
      url:app.globalData.ip +'/getBill',
      method:'get',
      data:{
        type:this.data.selectPickers.type=='day'?1:0,
        time:this.data.timePick
      },
      success:function(res){
        let allIncome = 0 , allPay = 0
        if(this.data.selectPickers.type=='day'){
          for(let i in res){
            res[i].time = res[i].time.substring(0,16)
          }
        }
        for(let i in res){
          if(res[i].type==0){
            allPay+=res[i].amount
          }else if(res[i].type==1) {
            allIncome += res[i].amount
          }
        }
        this.setData({
          billList:res,
          shiftBillBar:false,
          allPay:allPay,
          allIncome:allIncome
        },()=>{
          this.setData({
            shiftBillBar:true
          })
        })
      }.bind(_this)
    }
    app.isLogin(obj)
  },
  refreshList:function(){
    this.getBillList()
  }
})
