<template>
  <div class="home">
    <!-- 2种写法都行 -->
    <!-- <HomeNavbar/> -->
    <home-navbar/>
    <div class="banner">
      <img src="/img/home/banner.webp" alt="">
    </div>
    <HomeSearchBox/>
  </div>
</template>

<script setup>
  import HomeNavbar from './cpns/home-navbar.vue'
  import HomeSearchBox from './cpns/home-search-box.vue';
</script>

<style lang="less" scoped>
  .home{
    .banner{
      img{
        width: 100%;
      }
    }
  }
</style>