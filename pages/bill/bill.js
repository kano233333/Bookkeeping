//index.js
//获取应用实例
const app = getApp()
const selectH = 6.133
let formatTime = require('../../utils/util').formatTime
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    islogin:false,
    billList:[],
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
    app.isSq();
    this.setTabBar(0)
    app.isLogin(this.getBillList.bind(this))
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
        type:this.data.selectPickers[0].type=='day'?1:0,
        time:this.data.timePick
        // type:1,
        // time:'2019-05-03'
      },
      success:function(res){
        let data = res.data.replace(/'/g,'"');
        let list = JSON.parse(data).data
        _this.setData({
          billList:list
        })
      }
    })
  }
})
