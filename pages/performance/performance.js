//index.js
var common = require('../../utils/util.js')
//获取应用实例
const app = getApp()

Page({
  data: {
      allLoad: false,
      page: 0,
      limit: 20,
      skey: '',
      list: []
  },
  getscore: function (e) {
      var score = e.currentTarget.dataset.score
      wx.showModal({
          title: '成绩查询',
          content: score,
          showCancel: false,
          confirmText: '关闭'
      })
  },
  search: function () {
      this.setData({
          page:0,
          allLoad: false,
          list: []
      })
      this.getList()
  },
  skeyname: function (e) {
     this.setData({
         skey: e.detail.value
     })
  },
  getList: function () {
    var that = this
    common.ajax({
        url: 'Index/getUserGrade',
        userinfo: true,
        data: {
            page: this.data.page,
            limit: this.data.limit,
            skey: this.data.skey
        },
        success:function (res) {
            if (that.data.page == 1) {
                that.setData({
                    list: res.result.list
                })
            } else {
                that.data.list = that.data.list.concat(res.result.list)
                that.setData({
                    list: that.data.list
                })
            }
            if (this.data.limit > res.result.list.length) {
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
  onLoad: function () {
      wx.setNavigationBarTitle({
          title: '我的成绩'
      });
      this.getList()
  },
  onReachBottom: function () {
      if (this.data.allLoad) return
      this.getList()
  }
})
