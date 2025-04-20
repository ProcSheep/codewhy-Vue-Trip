import { defineStore } from "pinia";

// 日期自动格式化
const startDate = new Date()
// 新的天数这样加,不要直接new Date()+1,防止出现'7月32日'
const endDate = new Date()
endDate.setDate(startDate.getDate() + 1) // 不返回新的值,直接改原对象

const useMainStore = defineStore('main',{
  // mainstore存放公用且常用的值
  state: ()=>({
    startDate: startDate,
    endDate: endDate,
    isLoading: false
  })
})

export default useMainStore