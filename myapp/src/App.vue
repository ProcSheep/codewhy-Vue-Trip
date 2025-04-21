<template>
  <div>
    <div class="page-content">
      <!-- 作用域插槽,默认值props,内有属性Component和route
        Component: 它代表当前路由匹配到的组件。这一属性一般用来动态渲染路由组件。
        route: path,query,params等useRoute的值 
      -->
      <!-- vue3建议keep-alive这样使用 -->
      <RouterView v-slot="props">
        <!-- home组件可以keep-alive -->
        <!-- 动态组件,组件就是当前匹配的路由组件(注释不要写进keep-alive里面,会报错) -->
        <keep-alive includes="home">
          <component :is="props.Component"></component>
        </keep-alive>
      </RouterView>
    </div>
    <!-- 方法1: 通过注册路由时配置meta属性来确定是否隐藏Tabbar组件 -->
    <TabBar v-if="!route.meta.hideTabbar"></TabBar>
    <!-- <TabBar/> -->
    <Loading />
  </div>
</template>

<script setup>
import TabBar from "@/components/tabbar/tabbar.vue";
import Loading from "./components/loading/loading.vue"; // 加载框
import { useRoute } from "vue-router";

const route = useRoute()
</script>

<style scoped>
/* 防止Tabbar遮挡页面 */
.page-content {
  /* Tabbar固定高度55px */
  margin-bottom: 55px;
}
</style>
