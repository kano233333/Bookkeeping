const app = getApp()
const icon = require('../../utils/base64')
const barHeight = '8.67vw'
Component({
  data: {
    moreShow:0,
    billHeight:barHeight,
    typeBill:'day',
    moreText:'...',
    textColor:'#f25350',
    icon:icon.outcome,
    iconAll:icon.all,
    iconX:["funny",0],
    src:'',
    text:''
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
      let billData = this.data.billData
      let src = '',text = ''
      if(billData.type==1){
        this.setData({
          textColor:'#67b098'
        })
      }
      if(billData.remarks===undefined){
        this.data.typeBill = "month"
        let date = billData.time.split('-')[2]
        date = Number(date)-1
        src = icon.month[date].value
        text = icon.month[date].name
        this.setData({
          moreText:''
        })
      }else{
        try{
          let iconX = billData.label.split("-")
          if(iconX.length>2){
            switch(iconX[2]){}
          }
          src = icon.all[iconX[0]][iconX[1]].value
          text = icon.all[iconX[0]][iconX[1]].name
        }catch (e) {}
      }
      this.setData({
        src:src,
        text:text
      })
    }
  }
});