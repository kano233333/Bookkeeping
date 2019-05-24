const app = getApp()
const icon = require('../../utils/base64')
const barHeight = '8.67vw'
const sicon = wx.getStorageSync('icon')
const color = {
  in:['#f25350','#fff2f1','#ea908d'],
  out:['#67a2df','#f1faff','#72b1eb']
}
Component({
  data: {
    moreShow:0,
    billHeight:barHeight,
    typeBill:'day',
    moreText:'...',
    textColor:color.in,
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
    },
    index:{
      type:Number,
      value:0
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
      console.log(this.data.billData)
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
            app.globalData.billIsChange = 1
            app.globalData.chartIsChange = 1
            app.globalData.userNum.totalAccount--
            wx.showToast({
              title: '删除成功',
              duration: 1000,
              icon:"none"
            })
            this.triggerEvent("refreshList",{index:this.data.index})
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
          textColor:color.out
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
          src = icon.all[iconX[0]][iconX[1]].value
          text = billData.iconName || icon.all[iconX[0]][iconX[1]].name
          if(iconX.length>2){
            for(let i=0;i<sicon.length;i++){
              if(billData.label == sicon[i].label){
                text = sicon[i].name
              }
            }
          }
        }catch (e) {}
      }
      this.setData({
        src:src,
        text:text
      })
    }
  }
});