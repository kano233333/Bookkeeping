Component({
  data: {
    moreShow:0,
    billClass:'bill_height1'
  },
  properties: {
    billData: {
      type: Object,
      value: {}
    }
  },
  methods: {
    showMore:function(){
      if(this.data.moreShow==0){
        this.setData({
          billClass:'bill_height2',
          moreShow:1
        })
      }else if(this.data.moreShow==1){
        this.setData({
          billClass:'bill_height1',
          moreShow:0
        })
      }
    }
  },
  lifetimes:{
    ready(){
      console.log(this.data.billData)
    }
  }
});