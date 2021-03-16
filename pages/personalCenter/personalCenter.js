//index.js
//获取应用实例
var common = require("../../utils/util.js");
const app = getApp()

Page({
  data: {
      messStatus: true,
      headimg: '',
      name: '',
      list: {}
  },
  clock: function () {
      if (!this.data.messStatus) return
      wx.navigateTo({
          url: '../clock/clock'
      })
  },
  opus: function () {
      if (!this.data.messStatus) return
      wx.navigateTo({
         url: '../opus/opus'
      })
  },
  performance: function () {
      if (!this.data.messStatus) return
      wx.navigateTo({
          url: '../performance/performance'
      })
  },
  energy: function () {
      if (!this.data.messStatus) return
      wx.navigateTo({
          url: '../energy/energy'
      })
  },
  leave: function () {
      if (!this.data.messStatus) return
      wx.navigateTo({
          url: '../leave/leave'
      })
  },
  meal: function () {
	  if (!this.data.messStatus) return
	  common.ajax({
	      url: 'Index/addMealsQuery',
	      userinfo: true,
	      success: function (res) {
			  if(res.status == 'SUCCESS'){
				  wx.showModal({
					  title: '提示',
					  content: '确认要使用吗？',
					  success: res => {
						  if(res.confirm){
						  	wx.navigateTo({
						  	    url: '../meal/meal'
						  	})
						  }
					  }
				  })
			  }
	      },
		  fail: res => {
			  wx.showToast({title:res.result.msg,icon:'none'})
		  }
	  })
  },
  onLoad: function () {
      var that = this
      if (common.get_userinfo()) {
         common.ajax({
             url: 'Index/getUserData',
             userinfo: true,
             success: function (res) {
                 that.setData({
                     list: res.result.list,
                     headimg: res.result.list.us_headimg,
                     name: res.result.list.us_nickname,
                     messStatus: true
                 })
             }
         })
      } else {
         if (app.globalData.userInfo) {
             this.setData({
                 headimg: app.globalData.userInfo.avatarUrl,
                 name: app.globalData.userInfo.nickName
             })
             common.login_by_wx(function () {})
         } else {
            this.setData({
                messStatus: false
            })
         }
      }
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
                        that.onLoad()
                    })
                    this.setData({
                        userInfo: e.detail.userInfo,
                        hasUserInfo: true
                    })
                }else{
                    that.onLoad()
                }
            },
            fail: function(res){
                app.globalData.userInfo = e.detail.userInfo
                wx.getSetting({
                    success: function(res){
                        if (res.authSetting['scope.userInfo']) {
                            common.login_by_wx(function () {
                                that.onLoad()
                            })
                        }
                    }
                });
            }
        })
    }
})
