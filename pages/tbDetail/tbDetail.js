const icon = require('../../utils/base64')
Page({
  data: {
    billData:{}
  },
  onLoad: function (options) {
    let iconX = billData.label.split("-")
    src = icon.all[iconX[0]][iconX[1]].value
    text = icon.all[iconX[0]][iconX[1]].name

    let bill = JSON.parse(options.billData)
    bill.src = src
    bill.labelName = text
    bill.tname = options.tname
    this.setData({
      billData:bill
    })
  }
})