//index.js
//获取应用实例
var common = require("../../utils/util.js");
const app = getApp()

Page({
  data: {
      time: 60,
      mobile: '',
      code: '',
      state: true
  },
  bindmobile:function (e) {
     this.setData({
         mobile: e.detail.value
     })
  },
  bindcode: function (e) {
      this.setData({
          code: e.detail.value
      })
  },
  bind: function () {
      var that = this
      if (!common.is_mobile(this.data.mobile)) {
          common.error('请填写正确的手机号')
          return false
      }
      if (this.data.code == '') {
          common.error('请填写验证码')
          return false
      }
      if (!this.data.state) {
          return false
      }
      this.setData({
          state: false
      })
      common.ajax({
          url: 'Login/changeMobile',
          data: {
              mobile: this.data.mobile,
              code: this.data.code,
              openid: this.data.openid,
              headimg: this.data.headimg
          },
          loading: '加载中..',
          userinfo: false,
          success:function(ret){
              that.setData({
                  state: true
              })
              common.set_userinfo(ret.result)
              common.success(ret.result.msg,function () {
                  setTimeout(function () {
                      wx.switchTab({
                          url: '../index/index'
                      })
                  }, 3000)
              })
          },

          fail: function (ret) {
              common.error(ret.result.msg)
              that.setData({
                  state: true
              })
          }
      })
  },
  send: function () {
      var that = this
      if (that.data.time != 60) {
          return
      }
      if (!common.is_mobile(this.data.mobile)) {
          common.error('请填写正确的手机号')
          return false
      }
      common.ajax({
          url: 'Login/sendBindingCode',
          data: {
              mobile: this.data.mobile
          },
          loading: '加载中..',
          userinfo: false,
          success:function(ret){
              common.success(ret.result.msg,function () {
                 var timer = setInterval(function () {
                     that.data.time --
                     that.setData({
                         time: that.data.time
                     })
                     if (that.data.time == 0) {
                         clearInterval(timer)
                         that.setData({
                             time: 60
                         })
                     }
                 }, 1000)
              })
          },
          fail: function (res) {
              common.error(res.result.msg)
          }
      })
  },
  onLoad: function (option) {
      wx.setNavigationBarTitle({
          title: '绑定手机号'
      });
      this.setData({
          headimg:app.globalData.userInfo.avatarUrl,
          openid: option.openid
      })
  }
})
