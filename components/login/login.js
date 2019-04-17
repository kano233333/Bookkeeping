const app = getApp()
Component({
  methods:{
    bindgetuserinfo(e){
      var user = e.detail.userInfo;
      app.globalData.userInfo = user;
      this.doLogin();
    },
    doLogin(){
      var _this = this;
      wx.login({
        success:function(res){
          if(res.code){
            // wx.request({
            //   url:_this.globalData.ip+'/userLogin',
            //   data:{
            //     code:res.code
            //   }
            // }).then((res)=>{
            //   wx.setStorageSync('sessionID', res.data.skey);
            wx.setStorageSync('sessionID', res.code);
            _this.triggerEvent("loginModel");
            // }).catch((err)=>{})
          }
        }
      })
    }
  }
})