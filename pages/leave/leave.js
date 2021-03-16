//index.js
//获取应用实例
var common = require('../../utils/util.js')
const app = getApp()

Page({
    data: {
        statusTitle: '审核状态',
        classifyTitle: '请假类型',
        dateTitle: '提交日期',
        page: 0,
        limit: 10,
        allLoad: false,
        cate_id: '',
        status: '',
        apply_date: '',
        list: [],
        selectArray1: [{
           ca_name: '全部'
        },{
            ca_name: '待审核'
        },{
            ca_name: '已通过'
        },{
            ca_name: '已驳回'
        }],
        selectArray2: [],
        selectArray3: [{
            ca_name: '全部'
        },{
            ca_name: '近三个月'
        }, {
            ca_name: '近六个月'
        },{
            ca_name: '6个月以上'
        }],
    },
    onLoad: function () {
        var that = this
        wx.setNavigationBarTitle({
            title: '我的请假'
        });
        common.ajax({
            url: 'Index/getLeaveCateList',
            success:(res) => {
                this.data.selectArray2 = res.result.list
                this.data.selectArray2.unshift({
                    ca_name: '全部',
                    ca_id: ''
                })
                this.setData({
                    selectArray2: this.data.selectArray2
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
    selectStatusClick1(e) {
        this.setData({
            status: e.detail.ca_name == '全部' ? '' : e.detail.ca_name
        })
        this.selectComponent("#classify").hiddenShow()
        this.selectComponent("#date").hiddenShow()
        this.reload()
    },
    selectStatusClick2(e) {
        this.setData({
            cate_id: e.detail.ca_id
        })
        this.selectComponent("#date").hiddenShow()
        this.selectComponent("#status").hiddenShow()
        this.reload()
    },
    selectStatusClick3(e) {
        this.setData({
            apply_date: e.detail.ca_name == '全部' ? '' : e.detail.ca_name
        })
        this.selectComponent("#classify").hiddenShow()
        this.selectComponent("#status").hiddenShow()
        this.reload()
    },
    addleave: function () {
        wx.navigateTo({
            url: '../addleave/addleave'
        })
    },
    myOpus: function () {
        var that = this
        common.ajax({
            url: 'Index/getMyLeaveList',
            data: {
                cate_id: that.data.cate_id,
                status: that.data.status,
                apply_date: that.data.apply_date,
                page: that.data.page,
                limit: that.data.limit,
            },
            userinfo: true,
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
