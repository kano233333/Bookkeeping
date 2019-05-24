// pages/teamDetail/teamDetail.js
Page({
  data: {
    type1: 0,
    xxx: {
      amount: 5,
      bid: "209",
      label: "medical-0",
      remarks: "",
      time: "2019-05-22 14:29:00.0",
      type: "1"
    }
  },
  onLoad: function (options) {
    console.log(options)
  },
  shiftType(e) {
    let type = e.target.dataset.type
    this.setData({
      type1: type,
    })
  },
  onShareAppMessage(res){
    let info = {
      title:'邀请加入',
      path:'/pages/accept/accept?tid=12&useName=aaa&tname=bbb'
    }
    return info
  }
})