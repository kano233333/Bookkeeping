import * as echarts from '../../components/ec-canvas/echarts'

var app = getApp()
const icon = require('../../utils/base64').icon
const getWeek = require('../../utils/util').getWeek
var lineData = [[], []]
var colData = [[], []]
var xAxisData = []
var barData = []
const threeTime = ['week', 'month', 'year']
Page({
  data: {
    type: 0,
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
    barData:[]
  },
  onLoad: function (options) {
    this.setTimePicker()
    this.getLineData()
  },
  shiftType(e) {
    let type = e.target.dataset.type
    this.data.threeTime = type
    this.data.selectIndex = 0
    this.setData({
      type: type,
      selectTime: this.data.timeArr[type][0],
      rangeArr: this.data.timeArr[type]
    })
    this.getLineData()
  },
  shiftType2(e) {
    let type = e.target.dataset.type
    let ec
    // switch (type) {
    //   case '0':
    //     ec = {
    //       onInit: setBar
    //     }
    //     break
    //   case '1':
    //     ec = {
    //       onInit: setBar
    //     }
    // }

    let _this = this
    let data = this.data.barData.outcome
    barData = []
    for(let i=0;i<data.length;i++){
      barData.push({name:data[i].label,value:data[i].amount})
    }
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
        console.log(res)
        let data = res
        barData = []
        this.data.barData = data
        try{
          for(let i=0;i<data.income.length;i++){
            barData.push({name:data.income[i].label,value:data.income[i].amount})
          }
        }catch (e) {}
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
        console.log(data)
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
  }
})

function setLine(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    // legend: {
    //   data: ['支出', '收入'],
    //   textStyle: {
    //     fontSize: 14
    //   },
    //   orient:'vertical'
    // },
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

function setCol(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  var xAxisData = [];
  var data1 = [];
  var data2 = [];
  for (var i = 0; i < 100; i++) {
    xAxisData.push('类目' + i);
    data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
    data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
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
    yAxis: {},
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

function setBar(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  let option = {
    grid:{
      x:0,
      y:0,
      x2:0,
      y2:0
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20
    },
    series:[{
      name:'哈哈',
      type:'pie',
      selectedMode: 'single',
      radius:'90%',
      // roseType:"angle",
      data:barData
    }]
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
