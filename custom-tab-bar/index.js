Component({
  data: {
    selected: 0,
    color: "#989898",
    selectedColor: "#de4346",
    addShow:false,
    list: [
      {
        "pagePath": "/pages/bill/bill",
        "text": "细则",
        "iconPath": "/static/imgs/bill1.png",
        "selectedIconPath": "/static/imgs/bill2.png"
      },
      {
        "pagePath": "/pages/jiChat/jiChat",
        "text": "小计",
        "iconPath": "/static/imgs/ji1.png",
        "selectedIconPath": "/static/imgs/ji2.png"
      },
      {
        "pagePath": "/pages/add/add",
        "text": "记一笔",
        "color": "#de4346",
        "iconPath": "/static/imgs/add.png",
        "selectedIconPath": "/static/imgs/add.png"
      },
      {
        "pagePath": "/pages/billChart/billChart",
        "text": "账池",
        "iconPath": "/static/imgs/chart1.png",
        "selectedIconPath": "/static/imgs/chart2.png"
      },
      {
        "pagePath": "/pages/user/user",
        "text": "我的",
        "iconPath": "/static/imgs/user1.png",
        "selectedIconPath": "/static/imgs/user2.png"
      }
    ]
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      var url = data.path
      if (data.index == 2) {
        console.log(this)
        this.setData({
          addShow: true,
        })
        try{
          getCurrentPages()[0].setData({
            canvasShow:false
          })
        }catch (e) {}
      } else {
        this.setData({
          addShow: false
        })
        var _this = this
        wx.switchTab({
          url:url,
          success:function(e){
            var page = getCurrentPages().pop()
            page.onLoad()
          }
        })
      }
    },
    hideAdd(){
      this.setData({
        addShow:false
      })
      try{
        getCurrentPages()[0].setData({
          canvasShow:true
        })
      }catch (e) {}
    }
  }
})