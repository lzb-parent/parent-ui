let DateUtil = {
  name: 'DateUtil',
  readDate: function (date) {
    try {
      //解决ios手机时间格式化NAN问题
      if (typeof (date) == "string" && date.indexOf('-') !== -1) {
        date = date.replace(/-/g, '/');
      }
      date = new Date(date);
    } catch (e) {
      console.error('date error', e)
    }
    return date
  },
  // 转换时间戳
  formatDate(time, fmt = 'yyyy-MM-dd') {
    return this.format(time,fmt);
  },
  // 转换时间戳
  formatTimeStamp(time, fmt = 'yyyy-MM-dd hh:mm:ss') {
    return this.format(time,fmt);
  },
  format(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
    if (typeof date === "string") {
      if (date.indexOf(".") > -1) {
        // 有些日期接口返回带有.0。
        date = date.substring(0, dateStr.indexOf("."));
      }
      // 解决IOS上无法从dateStr parse 到Date类型问题
      date = date.replace(/-/g, '/');
      date = new Date(date)
    }
    let o = {
      "M+": date.getMonth() + 1,                 // 月份
      "d+": date.getDate(),                    // 日
      "h+": date.getHours(),                   // 小时
      "m+": date.getMinutes(),                 // 分
      "s+": date.getSeconds(),                 // 秒
      "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
      "S": date.getMilliseconds()             // 毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  },
  addDay(date, n) {
    return DateUtil.add(date, n, 'day')
  },
  addHour(date, n) {
    return DateUtil.add(date, n, 'hour')
  },
  addMinute(date, n) {
    return DateUtil.add(date, n, 'minute')
  },
  addSecond(date, n) {
    return DateUtil.add(date, n, 'second')
  },
  //获取前后的时间,n可为负数和小数
  add(date, n, unit) {
    if (!date) {
      return null
    }
    if (typeof date === 'string') {
      date = date.replace(/-/g, "/")
    }
    // let million_second = 0;
    switch (unit) {
      case 'day':
        unit = 1000 * 60 * 60 * 24
        break;
      case 'hour':
        unit = 1000 * 60 * 60
        break;
      case 'minute':
        unit = 1000 * 60
        break;
      case 'second':
        unit = 1000
        break;
    }
    return new Date(date.getTime() + n * unit)
  }
};
export default DateUtil

