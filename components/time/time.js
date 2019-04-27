Component({
  data: {},
  properties: {
    fields: {
      type: String,
      value: 'month'
    },
    start: {
      type: String,
    },
    end: {
      type: String
    }
  },
  methods: {
    bindDateChange: function (e) {
      this.triggerEvent('pickerEvent',{timeData:e.detail.value})
    }
  }
});