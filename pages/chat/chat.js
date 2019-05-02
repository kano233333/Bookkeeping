// pages/chat/chat.js
Page({
  data: {
    scrollTop: 0,
    inputValue:'',
    chatList:[
      {
        type:"0",
        value:"hi"
      }
    ],
    valueX:'',
    inputFocus:false
  },
  onLoad:function(){
    this.setScrollTop()
  },
  setScrollTop:function(){
    let len = this.data.chatList.length
    if(len*50<300){
      return
    }
    this.setData({
      scrollTop:len*50
    })
  },
  sendChat:function(){
    let obj = {
      type:"1",
      value:this.data.inputValue
    }
    let list = this.data.chatList
    list.push(obj)
    let _this = this
    this.setData({
      chatList:list,
      valueX:''
    },()=>{
      _this.setScrollTop()
    })
  },
  getInput:function(e){
    let value = e.detail.value
    this.data.inputValue = value
  }
})