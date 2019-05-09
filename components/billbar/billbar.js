const app = getApp()
const icon = require('../../utils/base64').icon
const barHeight = '8.67vw'
Component({
  data: {
    moreShow:0,
    billHeight:barHeight,
    typeBill:'day',
    moreText:'...',
    textColor:'#f25350',
    icon:icon
  },
  properties: {
    billData: {
      type: Object,
      value: {}
    }
  },
  methods: {
    showMore:function(){
      if(this.data.typeBill=='month'){
        this.data.moreShow==0
        return
      }
      if(this.data.moreShow==0){
        this.setData({
          billHeight:"23vw",
          moreShow:1
        })
      }else if(this.data.moreShow==1){
        this.setData({
          billHeight:barHeight,
          moreShow:0
        })
      }
    },
    editBill:function(){
      wx.navigateTo({
        url:'/pages/sdAdd/sdAdd?type='+this.data.billData.type+'&mode=edit&billData='+JSON.stringify(this.data.billData)
      })
    },
    deleteBill:function(){
      let _this = this
      let delObj = {
        url:app.globalData.ip+'/delBill',
        method:'get',
        data:{
          bid:this.data.billData.bid
        },
        success:function(res){
          let data = res
          if(data.static == 1){
            wx.showToast({
              title: '删除成功',
              duration: 1000,
              icon:"none"
            })
            this.triggerEvent("refreshList")
          }
        }.bind(this)
      }
      app.isLogin(delObj)
    }
  },
  lifetimes:{
    ready:function(){
      if(this.data.billData.remarks===undefined){
        this.data.typeBill = "month"
        this.setData({
          moreText:''
        })
      }
      if(this.data.billData.type==1){
        this.setData({
          textColor:'#67b098'
        })
      }
    }
  }
});