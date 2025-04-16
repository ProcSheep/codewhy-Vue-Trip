<template>
  <div class="home-sea-box">
    <div class="location">
      <div class="city" @click="goCity">广州</div>
      <div class="position" @click="getLocation">
        <span class="text">我的位置</span>
        <img src="/img/home/icon_location.png" alt="">
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

  const router = useRouter()

  // 跳转到位置/城市页面 
  const goCity = () =>{
    router.push('/city')
  }

  // 获取地理位置
  const getLocation = () =>{
    // 基础js的api
    navigator.geolocation.getCurrentPosition(res=>{
      console.log('获取位置成功!')
      const crd = res.coords
      // 经纬度,在公司会把经纬度发给服务器,计算后返回给前端城市信息,也可以用高德,腾讯地图的共用api
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);
    },err => {
      console.log('获取位置失败')
      console.warn(`ERROR(${err.code}): ${err.message}`);
    },{
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    })
  }
</script>

<style scoped>
.home-sea-box {
  .location {
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0 20px;

    .city {
      flex: 1;
      font-size: 15px;
    }

    .position {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 74px;

      .text {
        font-size: 12px;
      }

      img {
        margin-left: 5px;
        width: 18px;
        height: 18px;
      }
    }
  }
}
</style>
