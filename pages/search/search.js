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
        list: [],
        skey: ''
    },
    search: function () {
        this.setData({
            page:0,
            allLoad: false,
            list: []
        })
        this.reload()
    },
    skeyname: function (e) {
        this.setData({
            skey: e.detail.value
        })
    },
    onLoad: function () {
        var that = this
        wx.setNavigationBarTitle({
            title: '全部作品'
        });
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
    opusdetail: function (e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../opusdetail/opusdetail?id=' + id
        })
    },
    myOpus: function () {
        var that = this
        common.ajax({
            url: 'Index/getProductionList',
            data: {
                page: that.data.page,
                limit: that.data.limit,
                skey: that.data.skey
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
    onReachBottom: function () {
        if (this.data.allLoad) return
        this.myOpus()
    }
})
