// pages/sdAdd/sdAdd.js
const icon = require("../../utils/base64").icon

Page({
  data: {
    type:0,
    icon:icon,
    selectIndex:''
  },
  onLoad: function (options) {
    this.data.type = options.type || 0;
  },
  shiftType(e){
    let type = e.target.dataset.type
    this.setData({
      type:type
    })
  },
  selectIcon(e){
    let index = e.target.dataset.index
    this.setData({
      selectIndex:index
    })
  }
})