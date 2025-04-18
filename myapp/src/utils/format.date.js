import dayjs from 'dayjs'
// 格式化月日
export function formatMonthDay(date){
  return dayjs(date).format('MM月DD日')
}
// 计算日期差值(天)
export function getDiffDays(startDate,endDate){
  return dayjs(endDate).diff(startDate,'day')
}