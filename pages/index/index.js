//index.js
var common = require("../../utils/util.js");
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    token: {},
    banner: [],
    student: [],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    onarr: {},
    twoarr: {},
    threearr: {},
    timeTitle: '时间',
    courseTitle: '名称',
    selectArray1: [],
    selectArray2: [{
      ca_name: '全部'
    },{
     ca_name: '近三个月'
    }, {
     ca_name: '近六个月'
    },{
     ca_name: '6个月以上'
    }],
    cate_id: '',
    date: '',
    order: '',
    page: 0,
    limit: 10,
    list: [],
    allLoad: false,
    bannerList: []
  },
  allopus: function () {
      wx.navigateTo({
          url: '../allopus/allopus'
      })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  punch: function () {
     wx.navigateTo({
       url: '../punch/punch'
     })
  },
  selectStatusClick1: function(e){
    var ca_id = e.detail.ca_id
    this.setData({
      cate_id: ca_id
    })
    this.selectComponent("#time").hiddenShow()
    this.reload()
  },
  reload: function(){
    this.setData({
      list: [],
      page: 0,
      allLoad: false
    })
    this.getList()
  },
  produceDetail(e){
     var index = e.currentTarget.dataset.index
     var id = this.data.bannerList[index].ba_product_id
      if (id == 0) return
      wx.navigateTo({
          url: '../opusdetail/opusdetail?id=' + id
      })
  },
  selectStatusClick2: function (e) {
      var date = e.detail.ca_name
      this.setData({
          date: date
      })
      this.selectComponent("#study").hiddenShow()
      this.reload()
  },
  spot: function (e) {
      if (this.data.order == '') {
          this.setData({
              order: '点赞'
          })
      } else {
          this.setData({
              order: ''
          })
      }
      this.reload()
  },
  listdetail: function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../opusdetail/opusdetail?id=' + id
    })
  },
  getBanner: function() {
      var that = this
      common.ajax({
          url: 'Index/getHomeContent',
          success: function (res) {
              var banner = []
              for(var i in res.result.banner) {
                  banner.push(res.result.banner[i].ba_path)
              }
              that.setData({
                  bannerList: res.result.banner,
                  banner: banner,
                  onearr: res.result.student[0],
                  twoarr: res.result.student[1],
                  threearr: res.result.student[2]
              })
          }
      })
  },
  ready: function () {
    var that = this
    common.ajax({
      url: 'Index/getCateList',
      success: function(res){
          var list = res.result.banner
          list.unshift({
              ca_id: '',
              ca_name: '全部'
          })
        that.setData({
          selectArray1: list
        })
      }
    })
    this.getBanner()
    this.getList()
  },
  getList: function() {
    var that = this
    common.ajax({
      url: 'Index/getProductionList',
      data: {
        cate_id: that.data.cate_id,
        date: that.data.date,
        order: that.data.order,
        page: that.data.page,
        limit: that.data.limit,
        label: '优秀'
      },
      success: function(res){
        if (that.data.page == 0) {
            that.setData({
              list: res.result.list
            })
        }else {
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
          that.data.page++
          that.setData({
            page: that.data.page
          })
        }
      }
    })
  },
  search: function () {
      wx.navigateTo({
          url: '../search/search'
      })
  },
  onLoad: function () {
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
    this.ready()
  },
  getUserInfo: function(e) {
    var that = this
      wx.getStorage({
          key: 'userinfo',
          success: function(res) {
              var userinfo = common.get_userinfo();
              if(!userinfo){
                  console.log(333444)
                  app.globalData.userInfo = e.detail.userInfo
                  common.login_by_wx(function () {
                      that.punch()
                  })
                  this.setData({
                      userInfo: e.detail.userInfo,
                      hasUserInfo: true
                  })
              }else{
                  that.punch()
              }
          },
          fail: function(res){
              app.globalData.userInfo = e.detail.userInfo
              wx.getSetting({
                  success: function(res){
                     if (res.authSetting['scope.userInfo']) {
                         common.login_by_wx(function (ret) {
                             that.punch()
                         })
                     }
                  }
              });
          }
      })
  },
  onReachBottom: function () {
    if (this.data.allLoad) return
    this.getList()
  }
})
