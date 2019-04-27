//index.js
//获取应用实例
const app = getApp()
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
    timePick:'2019-04-12'
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
  }
})
