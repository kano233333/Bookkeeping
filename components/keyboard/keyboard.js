let formatTime = require('../../utils/util').formatTime
Component({
  data:{
    keyArr:[
      {key:1,name:1},
      {key:2,name:2},
      {key:3,name:3},
      {key:"+",name:"+"},
      {key:4,name:4},
      {key:5,name:5},
      {key:6,name:6},
      {key:"-",name:"-"},
      {key:7,name:7},
      {key:8,name:8},
      {key:9,name:9},
      {key:"*",name:"*"},
      {key:"sq",name:"收起"},
      {key:0,name:0},
      {key:".",name:"."},
      {key:"/",name:"/"}
      ],
    timePick:formatTime(new Date,'day'),
    fields:'day'
  },
  properties:{
    inputValue:{
      type:String,
      default:''
    }
  },
  methods:{
    setValue:function(e){
      var value = e.target.dataset.value
      var inputValue = this.data.inputValue
      var arr = ["+","-","*","/"]
      if(arr.indexOf(value,2)!=-1 && inputValue==''){
        return
      }else if(arr.indexOf(value)!=-1 && arr.indexOf(inputValue[inputValue.length-1])!=-1){
        return
      }
      if(value=='sq'){
        this.triggerEvent('setAmount');
        return
      }
      this.data.inputValue = inputValue+value
      this.triggerEvent('setValue', { value:this.data.inputValue});
    },
    keyBack:function(){
      this.triggerEvent('setAmount');
    },
    deleteOne:function(){
      let value = this.data.inputValue
      this.data.inputValue = value.substring(0,value.length-1)
      this.triggerEvent('setValue', { value:this.data.inputValue});
    },
    bindDateChange:function(e){
      this.setData({
        timePick:e.detail.value
      })
      this.triggerEvent('pickerEvent',{timeData:e.detail.value})
    }
  }
})