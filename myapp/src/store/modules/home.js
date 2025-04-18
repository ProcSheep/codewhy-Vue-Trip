import {defineStore} from 'pinia'
import {getHotSuggests,getHomeCategories,getHouseList} from '@/service'

const useHomeStore = defineStore("home",{
  state: ()=>({
    hotSuggests: [], // 热门建议
    categories: [], // 分类列表
    houseList:[], // 房子列表
    currentPage: 1 // 请求页面
  }),
  actions:{
    async fetchHotSuggests(){
      const res = await getHotSuggests()
      this.hotSuggests = res.data
    },
    async fetchCategories(){
      const res = await getHomeCategories()
      this.categories = res.data
    },
    async fetchHouseList(){
      const res = await getHouseList(this.currentPage)
      // 不要覆盖之前的数据,追加新数据push
      this.houseList.push(...res.data)
      this.currentPage ++
    }
  }
})

export default useHomeStore