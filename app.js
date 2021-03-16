//app.js
var common = require("utils/util.js");
App({
  onLaunch: function () {
     common.location((res) => {
       this.globalData.lon = res.longitude
       this.globalData.lat = res.latitude
       var locationString = res.latitude + "," + res.longitude;
       var that = this
       wx.request({
         url: 'https://apis.map.qq.com/ws/geocoder/v1/?l&get_poi=1',
         data: {
           "key" : "D3KBZ-7N6W2-JO6UD-CBSOG-IXN56-4XBXS",
           "location" : locationString
         },
         method: 'GET',
         success: function(res){
           that.globalData.address = res.data.result.address
         },
         fail: function() {
           console.log("请求失败");
         },
         complete: function() {
           console.log("请求完成");
         }
       })
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    lon: null,
    lat: null,
    address: null
  }
})