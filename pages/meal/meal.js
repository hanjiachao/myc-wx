// pages/meal/meal.js
var common = require("../../utils/util.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  date: '',
	  code: '',
	  status: ''
  },

  getDate(){
	  let date = new Date()
	  let y = date.getFullYear()
	  let m = date.getMonth() + 1
	  let d = date.getDate()
	  let hh = date.getHours()
	  let mm = this.getZero(date.getMinutes())
	  let ss = this.getZero(date.getSeconds())
	  let dateStr = `${y}-${m}-${d} ${hh}:${mm}:${ss}`
	  this.setData({
	    date: dateStr
	  })
  },
  getZero(num){
	  return num < 10 ? '0' + num : num
  },
  getCode(){
	  common.ajax({
	      url: 'Index/getLunchStatus',
	      userinfo: true,
	      success: res => {
			  let data = res.result
	          this.setData({
	              code: data.qrode,
				  status: data.status
	          })
	      }
	  })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  wx.setNavigationBarTitle({title: '我的用餐'})
	  this.getDate()
	  this.getCode()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})