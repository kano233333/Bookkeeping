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
    app.isSq();
    this.setTabBar(0)
    app.isLogin(this.getBillList.bind(this))
  },
  getPickerTimer(data){
    let _this = this
    this.setData({
      timePick:data.detail.timeData
    },()=>{
      app.isLogin(_this.getBillList.bind(_this))
    })
  },
  setTabBar(index){
    console.log('sss')
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: index
      })
    }
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
      app.isLogin(_this.getBillList.bind(_this))
    })
  },
  getBillList:function(sessionID){
    let _this = this
    wx.request({
      header: {
        cookie: "JSESSIONID=" + sessionID + ";domain=localhost;path=/wx"
      },
      url:app.globalData.ip+'/getBill',
      method:'get',
      data:{
        type:this.data.selectPickers.type=='day'?1:0,
        time:this.data.timePick
      },
      success:function(res){
        let allIncome = 0 , allPay = 0
        let data = res.data.replace(/'/g,'"')
        let list = JSON.parse(data).data
        if(_this.data.selectPickers.type=='day'){
          for(let i in list){
            list[i].time = list[i].time.substring(0,16)
          }
        }
        for(let i in list){
          if(list[i].type==0){
            allPay+=list[i].amount
          }else if(list[i].type==1){
            allIncome+=list[i].amount
          }
        }
        _this.setData({
          billList:list,
          shiftBillBar:false,
          allPay:allPay,
          allIncome:allIncome
        },()=>{
          _this.setData({
            shiftBillBar:true
          })
        })
      }
    })
  },
  refreshList:function(){
    app.isLogin(this.getBillList.bind(this))
  }
})
