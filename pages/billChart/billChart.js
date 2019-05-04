import * as echarts from '../../components/ec-canvas/echarts'
var app = getApp()
const icon = require('../../utils/base64').icon
Page({
  data: {
    type:0,
    type2:0,
    ec1: {
      onInit: setWeek
    },
    ec2:{
      onInit: setCol
    },
    shift2:true,
    canvasShow:true
  },
  onLoad: function (options) {
    this.setTabBar(3)
    this.setData({
      canvasShow:true
    })
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
      type:type
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
  }
})

function setWeek(canvas, width, height){
  const chart = echarts.init(canvas, null , {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    legend: {
      data:['支出','收入','余额']
    },
    tooltip: {
      trigger: 'axis'
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
      type: 'value'
    },
    series: [
      {
        name:'支出',
        type:'line',
        stack: '总量',
        data:[120, 132, 101, 134, 90, 230, 210]
      },
      {
        name:'收入',
        type:'line',
        stack: '总量',
        data:[220, 182, 191, 234, 290, 330, 310]
      },
      {
        name:'余额',
        type:'line',
        stack: '总量',
        data:[150, 232, 201, 154, 190, 330, 410]
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
