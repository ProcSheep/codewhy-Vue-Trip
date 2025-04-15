<template>
  <div>
    <div class="tabbar">
      <!-- v-model负责确定currentIndex的值,点击的索引 -->
      <van-tabbar v-model="currentIndex">
      <!-- <template v-for="(item, index) in tabbarData" :key="item.path">
        <van-tabbar-item :to="item.path">
          <span>{{ item.text }}</span>
          <template #icon>
            <img v-if="currentIndex !== index" class="img" :src="getImgURL(item.image)" alt="">
            <img v-else class="img" :src="getImgURL(item.imageActive)" alt="">
          </template>
        </van-tabbar-item>
      </template> -->
      <van-tabbar-item icon="home-o">标签</van-tabbar-item>
      <van-tabbar-item icon="home-o">标签</van-tabbar-item>
      <van-tabbar-item icon="home-o">标签</van-tabbar-item>
      <van-tabbar-item icon="home-o">标签</van-tabbar-item>
    </van-tabbar>
    </div>
  </div>
</template>

<script setup>
import { tabbarData } from '@/assets/data/tabbar.js'
import { getImgURL } from '@/utils/load_image.js'
import { ref } from 'vue';

const currentIndex = ref(0)

</script>

<style lang="less" scoped>
  .tabbar {
    // img{
    //   width: 32px;
    // }
    :deep(.van-tabbar-item){
      font-size: 25px;
      color: red;
    }
  }
</style>
