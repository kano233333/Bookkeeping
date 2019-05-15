
var app = getApp()
Page({
  data: {
    userData:{},
    signInDays:0,
    totalAccount:0
  },
  onLoad: function (options) {
    this.onShow()
    this.setCanvas()
  },
  onShow: function (options) {
    this.setData({
      signInDays:app.globalData.userNum.signInDays,
      totalAccount:app.globalData.userNum.totalAccount,
      userData:app.globalData.userInfo
    })
  },
  setCanvas:function(){
    var allW = wx.getSystemInfoSync().windowWidth+60
    var allH = 260
    const ctx = wx.createCanvasContext('line_canvas')

    var ballArr = [];
    (function(){
      for(var i=0;i<10;i++){
        //创建指定个数小圆球
        new Ball()
      }
    })();
    //小圆球对象
    function Ball(){
      this.x = randomNum(0,allW);
      this.y = randomNum(0,allH);
      this.color = "rgba("+Math.random()*255+","+Math.random()*255+","+Math.random()*255+Math.random()+")";
      this.r = randomNum(1,3);
      var rand = Math.random();
      this.speedX = (Math.random()>0.5) ? rand : -rand;
      rand = Math.random();
      this.speedY = (Math.random()>0.5) ? rand : -rand;
      ballArr.push(this);
    }

    Ball.prototype.draw = function(){
      ctx.beginPath();
      // ctx.fillStyle = this.color;
      ctx.fillStyle = "#ffffff"
      ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      // ctx.arc(this.x,0,this.r,0,Math.PI*2);
      ctx.fill();
    }

    Ball.prototype.move = function(){
      this.x = this.x+this.speedX;
      this.y = this.y+this.speedY;

      if(this.x<=-30 || this.x>=allW-20){
        this.speedX = -this.speedX;
      }

      if(this.y<=-30 || this.y>=allH){
        this.speedY = -this.speedY;
      }
    }

    var timer = setInterval(function(){
      ctx.clearRect(0,0,allW,allH);
      for(var i = 0;i<ballArr.length;i++){
        ballArr[i].draw();
        ballArr[i].move();
      }
      ballLine();
    ctx.draw()
    },20)

    //小圆球之间的连线
    function ballLine(){
      for(var i = 0;i<ballArr.length;i++){
        for(var j = 0;j<ballArr.length;j++){
          //距离
          if(i!=j && Math.sqrt(Math.pow(ballArr[i].x-ballArr[j].x,2)+Math.pow(ballArr[i].y-ballArr[j].y,2))<200){
            ctx.beginPath();
            ctx.moveTo(ballArr[i].x,ballArr[i].y);
            ctx.lineTo(ballArr[j].x,ballArr[j].y);
            ctx.strokeStyle = "rgba(255,255,255,0.2)";
            ctx.stroke();
          }
        }
      }
    }
    function randomNum(start,end){
      return Math.floor(Math.random()*(end-start)+start);
    }
  }
})