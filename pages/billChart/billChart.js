import * as echarts from '../../components/ec-canvas/echarts'

var app = getApp()
const icon = require('../../utils/base64')
const getWeek = require('../../utils/util').getWeek
var lineData = [[], []]
var colData = [[], []]
var xAxisData = []
var barData = [],barLegend = []
const threeTime = ['week', 'month', 'year']
Page({
  data: {
    type: 0,
    type1:0,
    type2: 0,
    ec1: {
      onInit: setLine
    },
    ec2: {
      onInit: setBar
    },
    shift2: true,
    canvasShow: true,
    timeArr: [['本周'], ['本月'], ['本年']],
    selectTime: "本周",
    rangeArr: [],
    threeTime: 0,
    selectIndex: 0,
    barData:[],
    isEmpty:false
  },
  onLoad: function (options) {
    this.setTimePicker()
    this.getLineData()
  },
  onShow:function(){
    if(app.globalData.chartIsChange){
      this.getLineData()
      app.globalData.chartIsChange = 0
    }
  },
  shiftType(e) {
    let type = e.target.dataset.type
    this.data.threeTime = type
    this.data.selectIndex = 0
    this.setData({
      type1: type,
      selectTime: this.data.timeArr[type][0],
      rangeArr: this.data.timeArr[type]
    })
    this.getLineData()
  },
  shiftType2(e) {
    let type = e.target.dataset.type
    let ec
    let _this = this
    let data = this.data.barData.outcome
    this.setBarChart(type)
    this.setData({
      type2: type,
      shift2: false
    }, () => {
      _this.setData({
        shift2: true
      })
    })
  },
  setTimePicker() {
    let dateT = new Date()
    let weekNum = getWeek(dateT)
    let monthNum = dateT.getMonth() + 1
    let pushTime = function (num, arr, str) {
      for (let i = num - 1; i > 0; i--) {
        arr.push('第' + i + str)
      }
      return arr
    }
    let weekArr = pushTime(weekNum, this.data.timeArr[0], '周')
    let monthArr = pushTime(monthNum, this.data.timeArr[1], '月')
    this.data.timeArr[0] = weekArr
    this.data.timeArr[1] = monthArr
    this.setData({
      rangeArr: this.data.timeArr[0]
    })
  },
  bindPickerChange(e) {
    let index = e.detail.value
    this.data.selectIndex = index
    this.setData({
      selectTime: this.data.rangeArr[index]
    })
    this.getLineData()
  },
  getLineData() {
    let barObj = {
      url: app.globalData.ip + '/graph',
      data: {
        category: threeTime[this.data.threeTime],
        offset: this.data.selectIndex * -1,
        isLabel: true
      },
      success: function (res) {
        let data = res
        console.log(res)
        barData = []
        this.data.barData = data
        let type = this.data.type==0 ? 'outcome' : 'income'
        this.setBarChart(this.data.type)
        this.setData({
          canvasShow: false
        }, () => {
          this.setData({
            canvasShow: true
          })
        })
      }.bind(this)
    }
    let lineObj = {
      url: app.globalData.ip + '/graph',
      data: {
        category: threeTime[this.data.threeTime],
        offset: this.data.selectIndex * -1,
        isLabel: false
      },
      success: function (res) {
        let data = res
        lineData = [[], []]
        xAxisData = []
        try{
          for (let i = 0; i < data.income.length; i++) {
            lineData[0].push(data.income[i].amount)
            lineData[1].push(data.outcome[i].amount)
            xAxisData.push(i + 1)
          }
        }catch (e) {}
        app.isLogin(barObj)
      }.bind(this)
    }
    app.isLogin(lineObj)
  },
  setBarChart:function(type){
    let typeX = type==1 ? 'income' :'outcome'
    let barDataX = this.data.barData[typeX]
    let arr = [],lArr = []
    this.setData({
      isEmpty:barDataX.length==0 ? true : false,
      type2:type
    })
    for(let i=0;i<barDataX.length;i++){
      let name = getName(barDataX[i].label)
      lArr.push(name)
      arr.push({
        value:barDataX[i].amount,
        name:name
      })
    }
    barData = arr
    barLegend = lArr
  }
})

function setLine(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    legend: {
      data: ['支出', '收入'],
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis',
      textStyle: {
        fontSize: 18
      }
    },
    grid: {
      left: '3%',
      right: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      textStyle: {
        fontSize: 18
      }
    },
    yAxis: {
      type: 'value',
      textStyle: {
        fontSize: 18
      }
    },
    series: [
      {
        name: '支出',
        type: 'line',
        stack: 'outcome',
        data: lineData[0]
      },
      {
        name: '收入',
        type: 'line',
        stack: 'income',
        data: lineData[1]
      }
    ]
  }
  chart.setOption(option);
  return chart;
}

function setBar(canvas, width, height) {
  const chart = echarts.init(canvas, 'light', {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  let option = {
    tooltip : {
      trigger: 'item',
      formatter: "{b}{c} ({d}%)",
      textStyle: {
        fontSize: 15
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: barLegend
    },
    series : [
      {
        type: 'pie',
        radius : '80%',
        center: ['50%', '60%'],
        data:barData,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label:{            //饼图图形上的文本标签
          normal:{
            show:true,
            // position:'inner', //标签的位置
            textStyle : {
              fontWeight : 300 ,
              fontSize : 16    //文字的字体大小
            }
          }
        }
      }
    ]
  };
  chart.setOption(option);
  return chart;
}

function setSun(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  var data = [
    {
      name: '支出',
      itemStyle: {
        color: '#a87b64'
      },
      children: [
        {
          name: '食物',
          itemStyle: {
            color: '#c78869',
            fontSize: 10
          },
          children: [{
            name: '酸',
            value: 1,
            itemStyle: {
              color: '#d4ad12'
            }
          }, {
            name: '甜',
            value: 1,
            itemStyle: {
              color: '#9d5433'
            }
          }, {
            name: '哭',
            value: 1,
            itemStyle: {
              color: '#c89f83'
            }
          }]
        },
        {
          name: '其他',
          itemStyle: {
            color: '#bb764c'
          },
          children: [
            {
              name: '1',
              value: 1,
              itemStyle: {
                color: '#692a19'
              }
            },
            {
              name: '2',
              value: 1,
              itemStyle: {
                color: '#470604'
              }
            }
          ]
        }]
    },
    {
      name: '收入',
      itemStyle: {
        color: '#e65832',
        fontSize: 10
      },
      children: [{
        name: '1',
        itemStyle: {
          color: '#d45a59'
        },
        children: [{
          name: '2',
          value: 1,
          itemStyle: {
            color: '#310d0f'
          }
        }, {
          name: '3',
          value: 1,
          itemStyle: {
            color: '#ae341f'
          }
        }, {
          name: '4',
          value: 1,
          itemStyle: {
            color: '#d78823'
          }
        }, {
          name: '5',
          value: 1,
          itemStyle: {
            color: '#da5c1f'
          }
        }]
      }, {
        name: '6',
        value: 1,
        itemStyle: {
          color: '#f89a80'
        }
      }, {
        name: '7',
        value: 1,
        itemStyle: {
          color: '#f37674'
        }
      }, {
        name: '8',
        value: 1,
        itemStyle: {
          color: '#e75b68'
        }
      }, {
        name: '9',
        value: 1,
        itemStyle: {
          color: '#d0545f'
        }
      }]
    }];
  let option = {
    series: {
      type: 'sunburst',
      // highlightPolicy: 'ancestor',
      data: data,
      radius: [0, '90%'],
      label: {
        rotate: 'radial'
      }
    }
  };

  chart.setOption(option);
  return chart;
}

function getName(label){
  let sp = label.split('-')
  if(sp.length>2){
    let _userIcon = app.globalData
    for(let i=0;i<_userIcon.length;i++){
      if(_userIcon[i].label==label){
        return _userIcon[i].name
      }
    }
  }
  return icon.all[sp[0]][sp[1]].name
}
