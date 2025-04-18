<template>
  <div class="categories">
    <template v-for="(item, index) in categories" :key="item.id">
      <div class="item">
        <img :src="item.pictureUrl" alt="">
        <div>{{ item.title }}</div>
      </div>
    </template>
  </div>
</template>

<script setup>
import useHomeStore from '@/store/modules/home';
import { storeToRefs } from 'pinia';

// 获取数据
const homestore = useHomeStore()
homestore.fetchCategories()
const { categories } = storeToRefs(homestore)

</script>

<style lang="less" scoped>
.categories {
  display: flex;
  // 局部横向滚动
  overflow-x: auto;
  height: 80px;
  padding: 0 10px;
  margin-top: 8px;

  // 删除浏览器默认的滚动条(伪元素::)
  &::-webkit-scrollbar {
    display: none;
  }

  .item {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 70px;
    text-align: center;

    img {
      width: 32px;
      height: 32px;
    }

    .text {
      font-size: 12px;
      margin-top: 8px;
    }
  }
}
</style>