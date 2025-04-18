<template>
  <!-- <div class="city top-page"> -->
  <div class="city">
    <div class="top">
      <van-search v-model="searchValue" placeholder="城市/区域/位置" show-action @cancel="onCancel" />
      <!-- tabActive绑定点击索引(0开始) -->
      <van-tabs v-model:active="tabActive">
        <template v-for="(value,key,index) in allCities" :key="key">
          <!-- 看文档,name属性可以固定tab标签的索引值 -->
          <van-tab :title="value.title" :name="key"></van-tab>
        </template>
      </van-tabs>
    </div>
    <div class="content">
      <template v-for="(value,key,index) in allCities" :key="index">
        <cityGroup v-show="tabActive === key" :group-data="value"></cityGroup>
      </template>
      <!-- <cityGroup :group-data="currentGroup"></cityGroup> -->
    </div>
  </div>
</template>

<script setup>
import usecityStore from '@/store/modules/city';
import cityGroup from './cpns/city-group.vue';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const tabActive = ref('')
const searchValue = ref('') 

const router = useRouter()
const onCancel = () => {
  router.back()
}

// 使用store
const cityStore = usecityStore()
cityStore.fetchAllCitiesData() // 调用里面的函数,获取城市数据
const {allCities} = storeToRefs(cityStore) // 使得allCities具有响应式,此时allCities是ref数据

// 国内-港澳台和海外的数据
// 使用key值直接从allCities中获取数据没有响应式,所以用计算属性,一旦计算属性内部依赖的值发生改变就会重新计算
// let currentGroup = computed(()=> allCities.value[tabActive.value])

</script>

<style lang="less" scoped>
.content{
  height: calc(100vh - 98px);
  overflow-y: auto;
}

</style>