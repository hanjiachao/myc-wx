//index.js
//获取应用实例
var common = require('../../utils/util.js')
const app = getApp()

Page({
    data: {
        page: 0,
        limit: 10,
        allLoad: false,
        list: [],
        info: {}
    },
    onLoad: function () {
        var that = this
        wx.setNavigationBarTitle({
            title: '蚂蚁能量'
        });
        this.myOpus()
    },
    reload: function(){
        this.setData({
            list: [],
            page: 0,
            allLoad: false
        })
        this.myOpus()
    },
    myOpus: function () {
        var that = this
        common.ajax({
            url: 'Index/getMyBillList',
            data: {
                page: that.data.page,
                limit: that.data.limit,
            },
            userinfo: true,
            success: function(res){
                if (that.data.page == 0) {
                    that.setData({
                        info: res.result,
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
    onReachBottom: function () {
        if (this.data.allLoad) return
        this.myOpus()
    }
})
