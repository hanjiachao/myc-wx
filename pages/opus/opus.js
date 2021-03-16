//index.js
//获取应用实例
var common = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
      page: 0,
      limit: 10,
      allLoad: false,
      info: {},
      list: []
  },
  onLoad: function () {
      wx.setNavigationBarTitle({
          title: '我的作品'
      });
      this.myOpus()
  },
  opusdetail: function (e) {
      var id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '../opusdetail/opusdetail?id=' + id
      })
  },
  myOpus: function () {
      var that = this
      common.ajax({
          url: 'Index/getUserProductionList',
          data: {
              page: that.data.page,
              limit: that.data.limit
          },
          userinfo: true,
          success: function (res) {
              if (that.data.page == 0) {
                  that.setData({
                      info: res.result,
                      list: res.result.list
                  })
              } else {
                  that.data.list = that.data.list.concat(res.result.list)
                  that.setData({
                      list: that.data.list
                  })
              }
              if (that.data.limit > res.result.list.length) {
                  that.setData({
                      allLoad: true
                  })
              } else {
                  that.data.page ++
                  that.setData({
                      page: that.data.page
                  })
              }
          }
      })
  },
    onReachBottom: function () {
        if (this.data.allLoad) return
        this.myOpus()
    }
})
