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
        this.myOpus()
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
                cate_id: that.data.cate_id,
                date: that.data.date,
                order: that.data.order,
                page: that.data.page,
                limit: that.data.limit,
                label: ''
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
