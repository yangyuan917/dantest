import { dayjs } from 'element-plus'

const getQueryStringByName = function (name) {
  var result = location.search.match(new RegExp('[?&]' + name + '=([^&]+)', 'i'))
  if (result == null || result.length < 1) {
    return ''
  }
  return result[1]
}

const transformData = function (data) {
  const params = new FormData()
  for (const item in data) {
    params.append(item, data[item])
  }
  return params
}

const DateFormat = function (date, fmt) {
  fmt = fmt || 'yyyy-MM-dd hh:mm:ss'
  if (date === null || typeof date === 'undefined' || date === '') {
    return null
  } else {
    // 时间要转成obj，否则报错
    date = new Date(date)
  }
  var o = {
    'M+': date.getMonth() + 1, // 月
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return fmt
}

const getTodayTime = () => {
  // 获取当前日期
  let currentDate = new Date();

  // 获取前一天的日期
  let previousDate = new Date(currentDate);
  previousDate.setDate(currentDate.getDate() - 1);

  // 格式化日期为'YYYY-MM-DD'格式
  let formattedDate = previousDate.toISOString().split('T')[0];
  return formattedDate
}

const lastMonthDay = (val) => {
  return   dayjs(val).subtract(1, 'month').format('YYYY-MM-DD')

}

export { getQueryStringByName, transformData, DateFormat, getTodayTime, lastMonthDay }
