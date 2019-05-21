var app = getApp()
const day = app.globalData.day
const bill = app.globalData.bill
const promisify = require('../../utils/promisify').p
const getImageInfo = promisify(wx.getImageInfo)
const color = [
  ['#ddd','#bdbdbd','#a5a5a5','#878787'],
  ['#deebff','#b3d1ff','#8ab6ff','#60a9ff'],
  ['#ffeacc','#ffd6b6','#ffb181','#ff825e']
]
Page({
  data: {
    path:app.globalData.ip+'/images/',
    billImgs:[],
    dayImgs:[],
    bgNum:0,
    dgNum:0,
    share:false
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
    wx.getSystemInfo({
      success:res=>{
        console.log(res)
        // this.data.allWidth = res.screenWidth
        // this.data.allHeight = res.screenHeight
        this.data.ratio = 750/res.screenWidth
      }
    })
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
  },
  save:function(){
    wx.canvasToTempFilePath({
      canvasId: 'share',
      success: function(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title:'成功',
              icon:"none",
              duration: 1000
            })
          },
          fail(res) {
            wx.showToast({
              title:'失败',
              icon:"none",
              duration: 1000
            })
          }
        })
      }
    })
  },
  showShare:function(e){
    if(this.data.share){
      this.setData({
        share:false
      })
      return
    }
    wx.showLoading()
    let src = e.target.dataset.src
    let colorX = color[0]
    if(src[1]=='g'){
      colorX = color[app.globalData.userInfo.gender]
    }
    src = this.data.path+src+'.png'
    this.drawShare(src,colorX)
    this.setData({
      share:true
    })
  },
  drawShare:function(src,colorArr){
    const width = 600/this.data.ratio
    const height = 900/this.data.ratio
    const ctx = wx.createCanvasContext('share')
    setImg(app.globalData.userInfo.avatarUrl)

    function setImg(url){
      setBadgeImage()
      function setHeader(){
        // getImageInfo({
        //   src:url
        // }).then((res)=>{
        //   let imgInfo = res
        //   ctx.beginPath()
        //   circleImg(ctx,url,width/2-25,40,25)
          text({
            textAligin:'center',
            color:'#333',
            fontSize:16,
            text:app.globalData.userInfo.nickName,
            x:width/2,
            y:35
          })
          ctx.drawImage('/static/logo/logo.png',0,0,144,144,10,height-50,40,40)
          ctx.drawImage('/static/logo/er.jpg',0,0,258,258,width-50,height-50,40,40)
          ctx.draw()
        wx.hideLoading()
        // })
      }


      function setBadgeImage(){
        wx.getImageInfo({
          src:src,
          success:(res=>{
            let imgInfo = res
            ctx.beginPath()
            drawBg()
            ctx.translate(0,height/2+20)

            for(let i=0;i<colorArr.length;i++){
              circleFill(width/2,-res.height/2,200-i*40,colorArr[i])
            }
            ctx.drawImage(res.path,0,0,res.width,res.height,(width-res.width)/2,-res.height,res.width,res.height)

            ctx.translate(0,-height/2-20)
            // const grd = ctx.createLinearGradient(0,height-60,width,60)
            // grd.addColorStop(0, '#cdd2f2')
            // grd.addColorStop(1, "#fff")
            // rect(0,height-60,width,60,grd)
            ctx.beginPath()
            ctx.moveTo(0,height-60)
            ctx.lineTo(width,height-60)
            ctx.setStrokeStyle('#000')
            ctx.stroke()
            rect(0,height-60,width,60,'#ffffff')
            setHeader()
          })
        })
      }
    }

    function circleImg(ctx, img, x, y, r) {
      ctx.beginPath()
      ctx.save();
      var d =2 * r;
      var cx = x + r;
      var cy = y + r;
      ctx.arc(cx, cy, r, 0, 2 * Math.PI)
      ctx.setFillStyle('#fff')
      ctx.fill()
      ctx.clip();
      ctx.drawImage(img, x, y, d, d);
      ctx.restore();
    }

    function text(obj){
      ctx.beginPath()
      ctx.setTextAlign(obj.textAligin)
      ctx.setFillStyle(obj.color)
      ctx.setFontSize(obj.fontSize)
      ctx.fillText(obj.text,obj.x,obj.y)
      ctx.stroke()
    }

    function circleNotFill(x,y,r,color){
      ctx.beginPath()
      ctx.arc(x,y,r,0,Math.PI*2)
      ctx.setStrokeStyle(color)
      ctx.stroke()
    }

    function circleFill(x,y,r,color){
      ctx.beginPath()
      ctx.arc(x,y,r,0,Math.PI*2)
      ctx.setFillStyle(color)
      ctx.fill()
    }

    function drawBg(n){
      // let r = 1000
      // ctx.translate(width/2,height/2)
      // n=24
      // let color = ['#87c7ff','#6b67ff']
      // let angle = Math.PI*2/n
      // for(let i=0;i<n;i++){
      //   ctx.beginPath();
      //   ctx.moveTo(0,0);
      //   ctx.lineTo(Math.cos(i*angle)*r,Math.sin(i*angle)*r);
      //   ctx.arc(0,0,r,i*angle,(i+1)*angle)
      //   ctx.setFillStyle(color[i%2])
      //   ctx.fill()
      // }
      //
      // ctx.translate(-width/2,-height/2)
      rect(0,0,width,height,"#fff")
    }

    function rect(x,y,width,height,color){
      ctx.beginPath()
      ctx.rect(x,y,width,height)
      ctx.setFillStyle(color)
      ctx.fill()
    }
  }
})