// pages/revise/revise.js
Page({
  data: {
    isChecked:false
  },
  shiftReset(e){
    var value = e.detail.value
    this.setData({
      isChecked:value
    })
  }
})