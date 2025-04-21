<template>
  <div class="detail" ref="detailRef">
    <!-- Tab栏 -->
    <TabControl 
      class="tabs" 
      v-if="showTabControl" 
      :titles="names"
      @tabItemClick="tabClick"
      ref="tabControlRef"
    />
    <!-- Navbar导航栏 -->
    <van-nav-bar title="房屋详情" left-text="旅途" left-arrow @click-left="onClickLeft" /> 
    <!-- 轮播,mainPart初始为undefined,网络请求是异步 -->
    <!-- v-memo解决vue的小bug,不要重复地执行:ref绑定getSectionRef函数 -->
    <div v-if="mainPart" v-memo="[mainPart]">
      <DetailSwipe :swipe-data="mainPart.topModule.housePicture.housePics" />
      <DetailInfos name="描述" :ref="getSectionRef" :top-infos="mainPart.topModule" />
      <DetailFacility name="设施" :ref="getSectionRef" :house-facility="mainPart.dynamicModule.facilityModule.houseFacility" />
      <!-- <DetailLandlord ref="landlordRef" :landlord="mainPart.dynamicModule.landlordModule" /> -->
      <DetailLandlord name="房东" :ref="getSectionRef" :landlord="mainPart.dynamicModule.landlordModule" />
      <DetailComment name="评论" :ref="getSectionRef" :comment="mainPart.dynamicModule.commentModule" />
      <DetailNotice name="须知" :ref="getSectionRef" :order-rules="mainPart.dynamicModule.rulesModule.orderRules" />
      <!-- <DetailMap/> -->
    </div>
    <div class="footer">
      <img src="/img/detail/icon_ensure.png" alt="">
      <div class="text">弘源旅途, 永无止境!</div>
    </div>
  </div>
</template>

<script setup>
import TabControl from '@/components/tab-control/tab-control.vue';
import DetailSwipe from './cpns/detail_01-swipe.vue';
import DetailInfos from './cpns/detail_02-infos.vue';
import DetailFacility from './cpns/detail_03-facility.vue';
import DetailLandlord from './cpns/detail_04-landlord.vue';
import DetailComment from "./cpns/detail_05-comment.vue";
import DetailNotice from "./cpns/detail_06-notice.vue"
import DetailMap from './cpns/detail_07-map.vue';

import { useRouter, useRoute } from 'vue-router';
import { getDetailInfos } from '@/service';
import { computed, ref,watch } from 'vue';
import useScroll from '@/hooks/useScroll';


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

// TabControl 
// 滚动监听,监听windows,不监听元素内的滚动,所以要修改hooks函数
const detailRef = ref() // 获取detail(div)元素,不可以js(document.querySelect),因为这时候dom树没挂载(看看vue的生命周期)
const {scrollTop} = useScroll(detailRef) // 传入要监听滚动的元素
const showTabControl = computed(() => {
  return scrollTop.value > 100
})

// 获取各个组件
// const landlordRef = ref()
// 单独获取ref太麻烦,函数统一获取
// const sectionEls = []
// const getSectionRef = (value) => {
//   // console.log('---------')
//   // console.log(value) // 参数value就是组件的ref.value
//   // console.log(value.$el) // 同理$el获取到组件根元素
//   sectionEls.push(value.$el)
// }
// 监听点击Tab的行为
// const tabClick = (index)=>{
//   detailRef.value.scrollTo({
//     // 滚动到XX位置(top),offsetTop是当前元素到页面顶部的距离,减去TabControl的高度(防遮挡)
//     // 通过ref获取元素后,记得.value,然后获取的是组件,通过.$el获取组件内的根元素
//     // top: landlordRef.value.$el.offsetTop - 44, 
//     top: sectionEls[index].offsetTop - 44,
//     behavior: 'smooth' // 平滑滚动
//   })
// }

// 改进 -> {'设施': value.$el , '房东': value.$el , ... }
const sectionEls = ref({})
// Tab-control栏的动态显示
const names = computed(() => {
  return Object.keys(sectionEls.value)
})

const getSectionRef = (value) => {
  // 获取根元素的name属性的值(组件透传,组件的根元素也有name属性)
  if(!value) return // 当离开页面卸载组件时,会再次执行这个函数,此时value为null,需要特殊处理
  const name = value.$el.getAttribute('name')
  sectionEls.value[name] = value.$el 
}

// 监听点击Tab的行为
const tabClick = (index)=>{
  const key = Object.keys(sectionEls.value)[index]
  const el = sectionEls.value[key]
  let instance = el.offsetTop
  detailRef.value.scrollTo({
    top: instance - 44,
    behavior: 'smooth' // 平滑滚动
  })
}

// 页面滚动,滚动时匹配tabcontrol
const tabControlRef = ref()
watch(scrollTop,(newValue) => {
  // 获取所有区域的offsetTop
  const els = Object.values(sectionEls.value)
  const values = els.map(el => el.offsetTop)
  // console.log(values,newValue + 44)
  // 匹配区域
  let index = values.length - 1
  for(let i=0; i<values.length; i++){
    // +60 处理tab顶部栏的占位,比44多一点是里面计算有点偏差,问题不大
    if(values[i] > newValue + 60){
      index = i - 1
      break;
    }
  }
  // console.log(index)
  // 内部封装过,currentIndex代表当前索引值
  tabControlRef.value?.setCurrentIndex(index)
})

</script>

<style lang="less" scoped>
.detail{
  height: 100vh;
  overflow-y: auto;
}
.tabs{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9;
}
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;

  img {
    width: 123px;
  }

  .text {
    margin-top: 12px;
    font-size: 12px;
    color: #7688a7;
  }
}
</style>