<template>
  <!-- Navbar导航栏 -->
  <van-nav-bar title="房屋详情" left-text="旅途" left-arrow @click-left="onClickLeft" />
  <!-- 轮播,mainPart初始为undefined,网络请求是异步 -->
  <div v-if="mainPart">
    <detailSwipe :swipe-data="mainPart.topModule.housePicture.housePics"/>
  </div>
</template>

<script setup>
import detailSwipe from './cpns/detail-swipe.vue';
import { useRouter,useRoute } from 'vue-router';
import { getDetailInfos } from '@/service';
import { computed, ref } from 'vue';

const route = useRoute()
const houseId = route.params.id

const router = useRouter()
const onClickLeft = () => {
  router.back()
}

// 房屋详情的网络请求
const detailInfos = ref({})
// 复杂数据拆解
const mainPart = computed(() => detailInfos.value.mainPart)
getDetailInfos(houseId).then(res => detailInfos.value = res.data)

</script>

<style lang="less" scoped></style>