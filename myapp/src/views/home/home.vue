<template>
  <div class="home">
    <!-- 2种写法都行 -->
    <!-- <HomeNavbar/> -->
    <home-navbar />
    <div class="banner">
      <img src="/img/home/banner.webp" alt="">
    </div>
    <HomeSearchBox />
    <!-- 分类组件 -->
    <HomeCategories />
    <!-- 客房列表 -->
    <HomeContent />
  </div>
</template>

<script setup>
// vue
import { watch } from 'vue';
// 组件
import HomeNavbar from './cpns/home-navbar.vue'
import HomeSearchBox from './cpns/home-search-box.vue';
import HomeCategories from './cpns/home-categories.vue';
import HomeContent from './cpns/home-content.vue';
// hooks
import useScroll from '@/hooks/useScroll';
// store
import useHomeStore from '@/store/modules/home';
const homestore = useHomeStore()


// 方法1: 回调函数不易控制
// useScroll(homestore.fetchHouseList)
// 方法2: 推荐变量方法
const { isReachBottom } = useScroll()
// 监听isReachBottom的变化,在没有immediate属性下,默认第一次不执行,之后只要变量变化,就执行回调
// 新变量值作为参数传递给回调函数,当到达底部时,newValue=true,请求新的数据
watch(isReachBottom, (newValue) => {
  if (newValue) {
    // 更严谨,在确定请求数据成功后在设置'未到达底部'
    homestore.fetchHouseList().then(() => {
      // 获取的isReachBottom是ref类型
      isReachBottom.value = false
    })
  }
})

</script>

<style lang="less" scoped>
.home {
  height: 100vh;

  .banner {
    img {
      width: 100%;
    }
  }
}
</style>