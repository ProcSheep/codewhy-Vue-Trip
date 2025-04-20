<template>
  <div class="home-content">
    <div class="title">热门精选</div>
    <div class="list">
      <template v-for="(item, index) in houseList" :key="item.data.houseId">
        <HouseItemV9 v-if="item.discoveryContentType === 9" :item-data="item.data" @click="itemClick(item.data)"/>
        <HouseItemV3 v-if="item.discoveryContentType === 3" :item-data="item.data" @click="itemClick(item.data)"/>
      </template>
    </div>
  </div>
</template>

<script setup>
// 客房页面的样式v3和v9,封装进组件
import HouseItemV9 from '@/components/home/house-item-v9.vue'
import HouseItemV3 from '@/components/home/house-item-v3.vue'
import useHomeStore from '@/store/modules/home';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const homestore = useHomeStore()
homestore.fetchHouseList()
const { houseList } = storeToRefs(homestore)

const router = useRouter()
const itemClick = (item) => {
  router.push('/detail/' + item.houseId)
}

</script>

<style lang="less" scoped>
.home-content {
  padding: 10px 8px;

  .title {
    font-size: large;
    font-weight: 900;
    margin: 8px;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>