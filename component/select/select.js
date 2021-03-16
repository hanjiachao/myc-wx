//index.js
//获取应用实例
Component({
  externalClasses: ['index-top'],
  properties: {
    nowtext: {
      type: String
    },
    proparray: {
      type: Array
    },
    style: {
      type: String
    }
  },
  data: {
    selectShow: false
  },
  methods: {
    selectToggle: function () {
      this.setData({
        selectShow: !this.data.selectShow
      })
    },
    hiddenShow: function() {
      this.setData({
        selectShow: false
      })
    },
    setText: function (e) {
        var name = e.target.dataset.item.ca_name
        this.setData({
          nowtext: name,
          selectShow: false
        })
        this.triggerEvent("selectStatus", e.target.dataset.item);
    }
  }
})
