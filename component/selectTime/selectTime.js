//index.js
//获取应用实例
const date = new Date()
console.log(date)
const years = [date.getFullYear()]
const months = []
const days = []

// for (let i = 1990; i <= date.getFullYear(); i++) {
//   years.push(i)
// }

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}
Component({
  properties: {
    nowtext: {
      type: String
    },
    // proparray: {
    //   type: Array
    // },
    // style: {
    //   type: String
    // }
  },
  data: {
    years,
    year: date.getFullYear(),
    months,
    month: date.getMonth() + 1,
    days,
    day: date.getDate(),
    value: [9999, date.getMonth(), date.getDate()-1,date.getHours() >= 12 ? 1:0],
    isDaytime: date.getHours() >= 12 ? false : true,
    nowTime: '',
    show: false
  },
  methods: {
    sure() {
      var date = this.data.year + '/' + this.data.month + '/'+ this.data.day + ' ' +(this.data.isDaytime ? "上午" : "下午")
      this.setData({
        nowTime: date,
        show: false
      })
      var array = {
        date: date,
        dateTime: this.data.year + '/' + this.data.month + '/'+ this.data.day + ' ' + (this.data.isDaytime ? "09:00" : "18:00"),
      }
      this.triggerEvent("selectSure", array);
    },
    bindChange(e) {
      const val = e.detail.value
      this.setData({
        year: this.data.years[val[0]],
        month: this.data.months[val[1]],
        day: this.data.days[val[2]],
        isDaytime: !val[3]
      })
    },
    noClick(){},
    hiddenShow(){
      this.setData({
        show: false
      })
    },
    selectTime() {
      this.setData({
        show: true
      })
    }
  }
})
