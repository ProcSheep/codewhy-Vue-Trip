<template>
  <div>
    <div class="tabbar">
      <template v-for="(item, index) in tabbarData" :key="item.path">
        <div 
          class="tabbarItem" 
          :class="{active: currentIndex === index}" 
          @click="itemClick(index)"
        >
          <img v-if="currentIndex !== index" class="img" :src="getImgURL(item.image)" alt="">
          <img v-else class="img" :src="getImgURL(item.imageActive)" alt="">
          <span class="text">{{ item.text }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { tabbarData } from '@/assets/data/tabbar.js'
import { getImgURL } from '@/utils/load_assets.js'
import { ref } from 'vue';

const currentIndex = ref(0)

const itemClick = (index)=>{
  currentIndex.value = index
}

</script>

<style lang="less" scoped>
.tabbar {
  height: 55px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  border-top: 1px solid orange;

  .tabbarItem {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &.active{
      color: var(--primary-color);
    }

    .img {
      width: 36px;
    }

    .text {
      margin-top: 2px;
    }
  }
}
</style>
