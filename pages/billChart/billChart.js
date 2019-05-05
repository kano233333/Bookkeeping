import * as echarts from '../../components/ec-canvas/echarts'
var app = getApp()
const icon = require('../../utils/base64').icon
const getWeek = require('../../utils/util').getWeek
var data1 = [120, 132, 101, 134, 90, 230, 210]
var data2 = [220, 182, 191, 234, 290, 330, 310]
Page({
  data: {
    type:0,
    type2:0,
    ec1: {
      onInit: setLine
    },
    ec2:{
      onInit: setCol
    },
    shift2:true,
    canvasShow:true,
    timeArr:[['本周'],['本月'],['本年']],
    selectTime:"本周",
    rangeArr:[]
  },
  onLoad: function (options) {
    this.setTabBar(3)
    this.setData({
      canvasShow:true
    })
    this.setTimePicker()
    let _this = this
    setTimeout(function(){
      data1 = [220, 182, 191, 234, 290, 330, 310]
      data2 = [220, 182, 191, 234, 290, 330, 310]
      _this.setData({
        ec1: {
          onInit: setLine,
        },
        canvasShow:false
      },()=> {
        _this.setData({
          canvasShow: true
        })
      })
      console.log('set')
    },5000)
  },
  setTabBar(index){
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: index
      })
    }
  },
  shiftType(e){
    let type = e.target.dataset.type
    this.setData({
      type:type,
      selectTime:this.data.timeArr[type][0],
      rangeArr:this.data.timeArr[type]
    })
  },
  shiftType2(e){
    let type = e.target.dataset.type
    let ec
    switch (type){
      case '0':
        ec = {
          onInit:setCol
        }
        break
      case '1':
        ec = {
          onInit:setBar
        }
    }
    let _this = this
    this.setData({
      type2:type,
      ec2:ec,
      shift2:false
    },()=>{
      _this.setData({
        shift2:true
      })
    })
  },
  setTimePicker(){
    let dateT = new Date()
    let weekNum = getWeek(dateT)
    let monthNum = dateT.getMonth()+1
    let pushTime = function(num,arr,str){
      for(let i=num-1;i>0;i--){
        arr.push('第'+i+str)
      }
      return arr
    }
    let weekArr = pushTime(weekNum,this.data.timeArr[0],'周')
    let monthArr = pushTime(monthNum,this.data.timeArr[1],'月')
    this.data.timeArr[0] = weekArr
    this.data.timeArr[1] = monthArr
    this.setData({
      rangeArr:this.data.timeArr[0]
    })
  },
  bindPickerChange(e){
    let index = e.detail.value
    this.setData({
      selectTime:this.data.rangeArr[index]
    })
    console.log('当前选择时间：'+index)
  },
  getLineData(index){
    let get = function(){
      // wx.request({
      //   url:app.globalData.ip+'/linerGraph',
      //   data:{
      //     category:'',
      //     time:index
      //   },
      //   success:function(){
          // data1
          // data2
        // }
      // })
    }

  }
})

function setLine(canvas, width, height){
  const chart = echarts.init(canvas, null , {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    legend: {
      data:['支出','收入'],
      textStyle:{
        fontSize:14
      }
    },
    tooltip: {
      trigger: 'axis',
      textStyle:{
        fontSize:18
      }
    },
    // grid: {
    //   left: '3%',
    //   right: '4%',
    //   bottom: '3%',
    //   containLabel: true
    // },
    xAxis: {
      type: 'category',
      data: ['周一','周二','周三','周四','周五','周六','周日'],
      textStyle:{
        fontSize:18
      }
    },
    yAxis: {
      type: 'value',
      textStyle:{
        fontSize:18
      }
    },
    series: [
      {
        name:'支出',
        type:'line',
        stack: '总量',
        data:data1
      },
      {
        name:'收入',
        type:'line',
        stack: '总量',
        data:data2
      }
    ]
  }
  chart.setOption(option);
  return chart;
}

function setCol(canvas, width, height){
  const chart = echarts.init(canvas, null , {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  var xAxisData = [];
  var data1 = [];
  var data2 = [];
  for (var i = 0; i < 100; i++) {
    xAxisData.push('类目' + i);
    data1.push((Math.sin(i / 5) * (i / 5 -10) + i / 6) * 5);
    data2.push((Math.cos(i / 5) * (i / 5 -10) + i / 6) * 5);
  }

  let option = {
    legend: {
      data: ['bar', 'bar2'],
      align: 'left'
    },
    tooltip: {},
    xAxis: {
      data: xAxisData,
      silent: false,
      splitLine: {
        show: false
      }
    },
    yAxis: {
    },
    series: [{
      name: 'bar',
      type: 'bar',
      data: data1,
      animationDelay: function (idx) {
        return idx * 10;
      }
    }, {
      name: 'bar2',
      type: 'bar',
      data: data2,
      animationDelay: function (idx) {
        return idx * 10 + 100;
      }
    }],
    animationEasing: 'elasticOut',
    animationDelayUpdate: function (idx) {
      return idx * 5;
    }
  }
  chart.setOption(option);
  return chart;
}

function setBar(canvas, width, height){
  const chart = echarts.init(canvas, null , {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  let  option = {
    tooltip : {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['直接访问','邮件营销','联盟广告']
    },
    series : [
      {
        name: '访问来源',
        type: 'pie',
        radius : '55%',
        center: ['50%', '60%'],
        data:[
          {value:335, name:'直接访问'},
          {value:310, name:'邮件营销'},
          {value:234, name:'联盟广告'},
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  chart.setOption(option);
  return chart;
}
