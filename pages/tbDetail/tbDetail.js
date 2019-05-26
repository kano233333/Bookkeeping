const icon = require('../../utils/base64')
Page({
  data: {
    billData:{}
  },
  onLoad: function (options) {
    let bill = JSON.parse(options.billData)
    let iconX = bill.label.split("-")
    let src = icon.all[iconX[0]][iconX[1]].value
    let text = icon.all[iconX[0]][iconX[1]].name
    bill.src = src
    bill.labelName = text
    bill.tname = options.tname
    this.setData({
      billData:bill
    })
  }
})