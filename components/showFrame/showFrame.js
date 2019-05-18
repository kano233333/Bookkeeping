var app = getApp()
Component({
  data:{
    path:app.globalData.ip+'/images/'
  },
  properties:{
    imgUrl:{
      type:String,
      default:''
    }
  }
})