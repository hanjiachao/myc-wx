//index.js
//获取应用实例
var common = require('../../utils/util.js')
const app = getApp()

Page({
    data: {
        classifyList: [],
        info: {
            cate_id: '',
            start_time: '',
            end_time: '',
            duration: '',
            remark: ''
        },
        indexClassify: -1,
        cate_name: '',
        list: [],
        startTime: '开始时间',
        endTime: '结束时间',
        startArray: {},
        endArray: {}
    },
    bindArea(e) {
        console.log(e.detail.value)
        this.data.info.remark = e.detail.value
        this.setData({
            info: this.data.info
        })
    },
    checkData() {
        if (this.data.info.cate_id == '') {
            common.error('请选择请假类型')
            return false
        }
        if (this.data.info.start_time == '') {
            common.error('请选择开始时间')
            return false
        }
        if(this.data.info.end_time == '') {
            common.error('请选择结束时间')
            return false
        }
        if(this.data.info.remark == ''){
            common.error('请输入请假事由')
            return false
        }
        return true
    },
    submit(){
        if(!this.checkData()) {
            return false
        }
        common.ajax({
            url: 'Index/applyLeave',
            data: this.data.info,
            userinfo: true,
            success:(res) => {
                common.success('申请成功')
                setTimeout(function () {
                    var pages = getCurrentPages();//获取页面栈
                    if (pages.length > 1) {
                        var prePage = pages[pages.length - 2];
                        prePage.reload()
                    }
                    wx.navigateBack({//返回
                        delta: 1
                    })
                }, 3000)
            },
            fail: () => {

            }
        })
    },
    selectClassify(e){
        this.data.info.cate_id = this.data.classifyList[e.detail.value].ca_id
        this.setData({
            indexClassify: e.detail.value,
            info: this.data.info
        })
    },
    selectStart(array) {
        this.data.info.start_time = array.detail.date
        this.setData({
            startArray: array.detail,
            info: this.data.info
        })
        this.duration()
    },
    selectEnd(array){
      this.data.info.end_time = array.detail.date
        this.setData({
            endArray: array.detail,
            info: this.data.info
        })
        this.duration()
    },
    getRemainderTime (startTime,endTime){
        var s1 = new Date(startTime),
            s2 = new Date(endTime),
            runTime = parseInt((s2.getTime() - s1.getTime()) / 1000);
        var year = Math.floor(runTime / 86400 / 365);
        runTime = runTime % (86400 * 365);
        var month = Math.floor(runTime / 86400 / 30);
        runTime = runTime % (86400 * 30);
        var day = Math.floor(runTime / 86400);
        runTime = runTime % 86400;
        var hour = Math.floor(runTime / 3600);
        runTime = runTime % 3600;
        var minute = Math.floor(runTime / 60);
        runTime = runTime % 60;
        var second = runTime;
        // console.log(year,month,day,hour,minute,second);
        return {
            month: month,
            day: day,
            hour: hour
        }

    },
    duration(){
        if (this.data.info.end_time == '')return
        if (this.data.info.start_time == '') return
        var time = this.getRemainderTime(this.data.startArray.dateTime,this.data.endArray.dateTime)
        console.log(time)
        if (time.day < 0) {
            this.data.info.duration = ''
            this.setData({
                info: this.data.info
            })
            common.error('结束时间小于开始时间')
        } else {
            if (time.month == 0 && time.day == 0 && time.hour == 0) {
               this.data.info.duration = 0.5
            } else {
                if (time.month > 0) {
                    this.data.info.duration = time.month + '月' + (time.day + (time.hour > 12 ? 1 : time.hour == 0 ? 0.5 : 0))
                } else {
                    var day = time.day + (time.hour > 8 ? 1 : time.hour == 0 ? 0.5 : 0)
                    this.data.info.duration = day
                }
            }
            this.setData({
                info: this.data.info
            })
        }
    },
    bindDateChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            date: e.detail.value
        })
    },
    getClassify(){
        var that = this
        common.ajax({
            url: 'Index/getLeaveCateList',
            success: function (res) {
                var array = []
                for(var i in  res.result.list){
                    array.push(res.result.list[i].ca_name)
                }
                that.setData({
                    classifyList: res.result.list,
                    list: array
                })
            }
        })
    },
    onLoad: function () {
        var that = this
        wx.setNavigationBarTitle({
            title: '蚂蚁能量'
        });
        this.getClassify()
    }
})
