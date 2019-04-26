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
        "iconPath": "/static/imgs/add1.png",
        "selectedIconPath": "/static/imgs/add2.png"
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
      console.log(data.index)
      if (data.index == 2) {
        this.setData({
          addShow: true,
          // selected: 2
        })
      } else {
        this.setData({
          addShow: false
        })
        wx.switchTab({url})
      }
    }
  }
})