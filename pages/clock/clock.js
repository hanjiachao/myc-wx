//index.js
//获取应用实例
var common = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      list: [],
      day: new Date().getDate(),
      firstArr: [],
      lastArr: [],
      show: false,
      nowDate: true
  },
  prevmonth: function () {
      var that = this
      var month = that.data.month - 1
      var year = that.data.year
      if (that.data.month == 1) {
          month = 12
          year = year - 1
      }
      that.setData({
          year: year,
          month: month,
          list: []
      })
      that.getWeek()
      that.getClock()
  },
  clock: function (e) {
      var item = e.currentTarget.dataset.item
      var status = e.currentTarget.dataset.item.status
      var record = ''
      if (status == '不是本月' || status == '放假') return
      if (status == '未签到') {
          record = '无打卡记录'
      } else {
          var recoreT = item.sign_time ? item.sign_time : '未打卡'
          var recoreB = item.exit_time ? item.exit_time : '未打卡'
          record = '上午签到:' + recoreT + '下午签退:' + recoreB
      }
      wx.showModal({
          title: '打卡记录',
          content: record,
          showCancel: false,
          confirmText: '关闭'
      })
  },
  nextmonth: function () {
      var that = this
      var month = that.data.month + 1
      var year = that.data.year
      if (that.data.month == 12) {
          month = 1
          year = year + 1
      }
      that.setData({
          year: year,
          month: month,
          list: []
      })
      that.getWeek()
      that.getClock()
  },
  getClock: function () {
      var that = this
      common.ajax({
          url: 'Index/getSignRecord',
          data: {
              month: that.data.month,
              year: that.data.year
          },
          loading: '正在加载...',
          userinfo: true,
          timeout: 10000,
          success: function (res) {
              var list = res.result.list
              that.data.firstArr = that.data.firstArr.concat(list)
              that.data.firstArr = that.data.firstArr.concat(that.data.lastArr)
              that.setData({
                  list: that.data.firstArr,
                  show: true
              })
              if (that.data.month == (new Date().getMonth() + 1) && that.data.year == new Date().getFullYear()) {
                  that.setData({
                      nowDate: true
                  })
              } else {
                  that.setData({
                      nowDate: false
                  })
              }
          },
          error: function () {
              that.setData({
                  show: true
              })
          }
      })
  },
  getuntilDay: function () {
      var nowdays = new Date();
      var year = this.data.year;
      var month = this.data.month + 1;
      if(month==0){
          month = 12;
          year = year-1;
      }
      if(month<10){
          month = '0'+month;
      }
      var myDate = new Date(year,month,0);
      return myDate.getDate()
  },
  getWeek: function () {
      var date = new Date();
      date.setFullYear(this.data.year)
      date.setMonth(this.data.month-1)
      date.setDate(1)
      var firstDay = date.getDay()
      date.setMonth(date.getMonth() + 1);
      var lastDate = new Date(date - 3600000*24);
      var lastday = 6 - lastDate.getDay()
      var prevDay = this.getuntilDay()
      var firstArr = []
      var lastArr = []
      for(var i = 0;i<firstDay;i++){
          var item = {
              date: prevDay,
              status: '不是本月'
          }
          prevDay--
          firstArr.push(item)
      }
      for(var j = 0;j<lastday;j++){
          var item = {
              date: (j + 1),
              status: '不是本月'
          }
          lastArr.push(item)
      }
      firstArr.reverse()
      this.setData({
          firstArr: firstArr,
          lastArr: lastArr
      })
  },
  onLoad: function () {
      wx.setNavigationBarTitle({
          title: '打卡记录'
      });
      this.getWeek()
      this.getClock()
  }
})
