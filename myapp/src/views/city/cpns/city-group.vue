<template>
  <!-- :index-list映射索引列表 -->
  <van-index-bar :index-list="indexList">
    <!-- 热门 -->
    <van-index-anchor index="热门" />
    <div class="list">
      <template v-for="(item, index) in groupData.hotCities" :key="index">
        <!-- <van-cell :title="item.cityName" /> -->
        <div class="hotCitiesItem" @click="selectCity(item)">{{ item.cityName }}</div>
      </template>
    </div>
    <!-- 索引表 -->
    <template v-for="(group, index) in groupData.cities" :key="index">
      <van-index-anchor :index="group.group" />
      <template v-for="(city, indey) in group.cities" :key="indey">
        <van-cell :title="city.cityName" @click="selectCity(city)" />
      </template>      
    </template>
  </van-index-bar>
</template>

<script setup>
import {computed} from 'vue'
import {useRouter} from 'vue-router'
import usecityStore from '@/store/modules/city.js'

const router = useRouter()
const cityStore = usecityStore()

const props = defineProps({
  groupData: {
    type: Object,
    default: {}
  }
})
// 获取城市的分组信息
const indexList = computed(() => {
  const list = props.groupData.cities.map(item => item.group)
  // 额外给热门加一个索引*
  list.unshift('*')
  return list
})

// 监听城市点击
const selectCity = (city) => {
  // 1.不确定传递给谁(太多),可以使用事件总线,统一发出,谁用谁监听
  // 2.(优选)保存到citystore
  // console.log(city)
  cityStore.currentCity = city
  // 返回上一级
  router.back()
}

</script>

<style lang="less" scoped>
  .list{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-right: 20px;
    padding: 10px;

    .hotCitiesItem{
      margin: 3px;
      width: 70px;
      height: 28px;
      border-radius: 14px;
      text-align: center;
      line-height: 28px;
      background-color: #fff4ec;
    }
  }
</style>