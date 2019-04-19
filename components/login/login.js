const app = getApp()
Component({
  methods:{
    bindgetuserinfo(e){
      this.triggerEvent("doLogin");
    }
  }
})