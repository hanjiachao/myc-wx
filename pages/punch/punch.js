//index.js
var common = require('../../utils/util.js')
//获取应用实例
const app = getApp()
Page({
    data: {
        show: true,
        markers: [{
            iconPath: '../../image/icon02-1.png',
            id: 0,
            latitude: '',
            longitude: '',
            width: 65,
            height: 70
        }],
        lon: '',
        lat: '',
        circles: [{
            latitude: '',
            longitude: '',
            radius: 30,
            fillColor: '#cbeaffbd',
            color: '#3199f1'
        }],
        punchStatus: false,
        ajaxStatus: true,
        address: ''
    },
    punch: function () {
        var that = this
        if(!that.data.ajaxStatus) {
            return false
        }
        that.setData({
            ajaxStatus: false
        })
        common.ajax({
            url: 'Index/clockSign',
            data: {
                lat: that.data.lat,
                lng: that.data.lon
            },
            userinfo: true,
            success: function (res) {
                common.success(res.result.msg)
                that.setData({
                    ajaxStatus: true
                })
                console.log(res)
            },
            fail: function (res) {
                common.error(res.result.msg)
                that.setData({
                    ajaxStatus: true
                })
            }
        })    
    },
    getSign: function () {
        var that = this
        common.ajax({
            url: 'Index/getSignData',
            userinfo: true,
            success: function (res) {
                that.data.circles[0].radius = res.result.sign_scope
                that.data.markers[0].latitude = res.result.list.c_lat
                that.data.markers[0].longitude = res.result.list.c_lng
                that.data.circles[0].latitude = res.result.list.c_lat
                that.data.circles[0].longitude = res.result.list.c_lng
                that.setData({
                    markers: that.data.markers,
                    circles: that.data.circles
                })
            }
        })
    },
    onLoad: function () {
        wx.setNavigationBarTitle({
            title: '打卡'
        });
        var that = this
        that.setData({
            lon: app.globalData.lon,
            lat: app.globalData.lat,
            address: app.globalData.address
        })
        that.getSign()
    }
})