<template>
  <div>
    <div class="tabbar">
      <!-- v-model负责确定currentIndex的值,点击的索引 -->
      <!-- 开启路由模式,tabbar根据路由url自动选择tabItem -->
      <van-tabbar v-model="currentIndex" active-color="#ff9527" route>
      <template v-for="(item, index) in tabbarData" :key="item.path">
        <van-tabbar-item :to="item.path">
          <span>{{ item.text }}</span>
          <template #icon>
            <img v-if="currentIndex !== index" class="img" :src="getImgURL(item.image)" alt="">
            <img v-else class="img" :src="getImgURL(item.imageActive)" alt="">
          </template>
        </van-tabbar-item>
      </template>
    </van-tabbar>
    </div>
  </div>
</template>

<script setup>
import { tabbarData } from '@/assets/data/tabbar.js'
import { getImgURL } from '@/utils/load_image.js'
import { ref,watch } from 'vue';
import { useRoute } from 'vue-router';

// 监听路由改变,改变currentIndex值,显示对应图标高亮
const route = useRoute()
const currentIndex = ref(0)
watch(route,(newRoute) => {
  const index = tabbarData.findIndex(item => item.path === newRoute.path)
  if(index === -1) return // 找不到就停止设置
  currentIndex.value = index
})

</script>

<style lang="less" scoped>
  .tabbar {
    // img{
    //   width: 32px;
    // }
    :deep(.van-tabbar-item){
      font-size: 12px;
    }
  }
</style>
