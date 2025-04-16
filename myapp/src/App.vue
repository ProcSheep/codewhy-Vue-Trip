<template>
  <div>
    <RouterView></RouterView>
    <!-- 方法1: 通过注册路由时配置meta属性来确定是否隐藏Tabbar组件 -->
    <TabBar v-if="!route.meta.hideTabbar"></TabBar>
    <!-- <TabBar/> -->
  </div>
</template>

<script setup>
import TabBar from "@/components/tabbar/tabbar.vue";
import { useRoute } from "vue-router";

const route = useRoute()
</script>

<style scoped></style>
