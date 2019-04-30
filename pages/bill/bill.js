//index.js
//获取应用实例
const app = getApp()
const selectH = 10.67
let formatTime = require('../../utils/util').formatTime
const billList = [
  {
    icon:'',
    text:'火锅',
    time:'2019-2-2',
    money:'45',
    type:1,
    id:0,
    more:'呵呵哈哈哈'
  },
  {
    icon:'',
    text:'火锅',
    time:'2019-2-2',
    money:'45',
    type:1,
    id:0,
    more:'呵呵哈哈哈'
  },
  {
    icon:'',
    text:'火锅',
    time:'2019-2-2',
    money:'45',
    type:1,
    id:0,
    more:'呵呵哈哈哈'
  }
]
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    islogin:false,
    billList:billList,
    timePick:formatTime(new Date,"month"),
    fields:'month',
    selectPickers:[
      {type:"month",value:"月账"},
      {type:"day",value:"日账"}
    ],
    selectHeight:selectH+'vw',
    selectShow:false,
    reload:true
  },
  onLoad: function () {
    // app.isSq();
    this.setTabBar(0)
  },
  getPickerTimer(data){
    this.setData({
      timePick:data.detail.timeData
    })
  },
  setTabBar(index){
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: index
      })
    }
  },
  selectPicker(e){
    let selectIndex = e.target.dataset.select
    let selectPickers = this.data.selectPickers
    let fields = selectPickers[selectIndex].type
    let isShow = this.data.selectShow
    if(isShow){
      let one = this.data.selectPickers[0]
      selectPickers[0] = selectPickers[selectIndex]
      selectPickers[selectIndex] = one
    }
    let height = isShow ? selectH+'vw ' : selectH*this.data.selectPickers.length+'vw'
    let _this = this
    this.setData({
      selectHeight:height,
      selectShow:!this.data.selectShow,
      selectPickers:selectPickers,
      fields:fields,
      timePick:formatTime(new Date,fields),
    })
  }
})
