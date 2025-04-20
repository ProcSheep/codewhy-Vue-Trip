<template>
  <!-- 这样写也有响应式,使用的少的变量这样写更省事 -->
  <div class="loading" v-if="mainstore.isLoading" @click="loadingClick">
    <div class="bg">
      <img src="/img/home/full-screen-loading.gif" alt="">
    </div>
  </div>
</template>

<script setup>
import useMainStore from '@/store/modules/main';

const mainstore = useMainStore()
const loadingClick = () => {
  mainstore.isLoading = false
}
</script>

<style lang="less" scoped>
.loading {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, .3);

  .bg {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 104px;
    height: 104px;
    background: url(/img/home/loading-bg.png) 0 0 / 100% 100%;

    img {
      width: 70px;
      height: 70px;
      // gif图片本身不太居中,和css设置无关
      margin-bottom: 8px;
    }
  }
}
</style>