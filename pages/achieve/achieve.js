var app = getApp()
const day = app.globalData.day
const bill = app.globalData.bill
Page({
  data: {
    path:app.globalData.ip+'/images/',
    billImgs:[],
    dayImgs:[],
    bgNum:0,
    dgNum:0
  },
  onShareAppMessage:function(options){
    console.log(options)
    return {
      title: '转发',
      // path: '/pages/index/index',
      success: function(res) {
        console.log(res)
      }
    }
  },
  onShow:function(){
    this.getBadge()
  },
  getBadge:function(){
    let set = function(con,str,res){
      let imgs = [],gnum = 0
      let num = parseInt(res.split(str)[1])
      let index = con.indexOf(num)
      for(let i=0;i<con.length;i++){
        if(i<index+1){
          imgs[i] = str+con[i]
          gnum++
        }else {
          imgs[i] = str[0]+con[i]
        }
      }
      return {imgs:imgs,num:gnum}
    }
    let res = app.globalData.badge
    let billImgs = set(bill,"bg",res.bill)
    let dayImgs = set(day,"dg",res.day)
    this.setData({
      billImgs:billImgs.imgs,
      dayImgs:dayImgs.imgs,
      bgNum:billImgs.num,
      dgNum:dayImgs.num
    })
  }
})