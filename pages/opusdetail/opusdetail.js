//index.js
//获取应用实例
var common = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
      userInfo: {},
      hasUserInfo: false,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      id: '',
      info: {},
      likeStatus: ''
  },
  getDetail: function () {
      var that = this
      var user = true
      if (!common.get_userinfo()) {
          user = false
      }
      common.ajax({
          url: 'Index/getProductionDetail',
          data: {
              pr_id: that.data.id
          },
          userinfo: user,
          success: function (res) {
              that.setData({
                  info: res.result.list,
                  likeStatus: res.result.list.like_status
              })
          }
      })
  },
  imagePreview: function(e){
      var item = e.currentTarget.dataset.item
      wx.previewImage({
          current: item,
          urls:this.data.info.picture
      })
  },
  like: function () {
      var that = this
      common.ajax({
          url: 'Index/addLikeNumber',
          data: {
              pr_id: that.data.id
          },
          userinfo: true,
          success: function (res) {
              that.data.info.like_status = '已点赞'
              that.data.info.pr_like_number = parseInt(that.data.info.pr_like_number) + 1
              that.setData({
                  info: that.data.info
              })
              common.success(res.result.msg)
          },
          fail: function (res) {
              common.error(res.result.msg)
          }
      })
  },
  onLoad: function (e) {
      this.setData({
          id: e.id
      })
      wx.setNavigationBarTitle({
          title: '作品详情'
      });
      if (app.globalData.userInfo) {
          this.setData({
              userInfo: app.globalData.userInfo,
              hasUserInfo: true
          })
      } else if (this.data.canIUse){
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          app.userInfoReadyCallback = res => {
              this.setData({
                  userInfo: res.userInfo,
                  hasUserInfo: true
              })
          }
      } else {
          // 在没有 open-type=getUserInfo 版本的兼容处理
          wx.getUserInfo({
              success: res => {
              app.globalData.userInfo = res.userInfo
      }
      })
      }
      this.getDetail()
  },
    getUserInfo: function (e) {
        var that = this
        wx.getStorage({
            key: 'userinfo',
            success: function(res) {
                var userinfo = common.get_userinfo();
                if(!userinfo){
                    app.globalData.userInfo = e.detail.userInfo
                    common.login_by_wx(function () {
                        that.like()
                    })
                }else{
                    that.like()
                }
            },
            fail: function(res){
                app.globalData.userInfo = e.detail.userInfo
                wx.getSetting({
                    success: function(res){
                        if (res.authSetting['scope.userInfo']) {
                            common.login_by_wx(function () {
                                that.like()
                            })
                        }
                    }
                });
            }
        })
    }
})
