<template>
  <div class="home-sea-box">
    <!-- 定位 -->
    <div class="location">
      <div class="city" @click="goCity">{{ currentCity.cityName }}</div>
      <div class="position" @click="getLocation">
        <span class="text">我的位置</span>
        <img src="/img/home/icon_location.png" alt="">
      </div>
    </div>

    <!-- 日期范围 -->
    <div class="section date-range bottom-gray-line" @click="isCalendarShow = true">
      <div class="start">
        <div class="date">
          <span class="tip">入住</span>
          <span class="time">{{ startDate }}</span>
        </div>
        <div class="stay">共{{ stayCount }}晚</div>
      </div>
      <div class="end">
        <div class="date">
          <span class="tip">离店</span>
          <span class="time">{{ endDate }}</span>
        </div>
      </div>
    </div>

    <!-- 日历 -->
    <van-calendar class="calendar" v-model:show="isCalendarShow" type="range" @confirm="onConfirm" color="#ff9527" />

    <!-- 价格/人数选择 -->
    <div class="section price-counter bottom-gray-line">
      <div class="start">价格不限</div>
      <div class="end">人数不限</div>
    </div>
    <!-- 关键字 -->
    <div class="section keyword bottom-gray-line">关键字/位置/民宿名</div>

    <!-- 热门建议 -->
    <div class="section hot-suggests">
      <template v-for="(item, index) in hotSuggests" :key="index">
        <div class="item" :style="{ color: item.tagText.color, background: item.tagText.background.color }">
          {{ item.tagText.text }}
        </div>
      </template>
    </div>

    <!-- 开始搜索 -->
    <div class="section search-btn" @click="searchBtn">
      <div class="btn">开始搜索</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia';
import { formatMonthDay, getDiffDays } from '@/utils/format.date.js'
import useCityStore from '@/store/modules/city';
import useHomeStore from '@/store/modules/home';


// 跳转到位置/城市页面 
const router = useRouter()
const goCity = () => {
  router.push('/city')
}

// 获取地理位置
const getLocation = () => {
  // 基础js的api
  navigator.geolocation.getCurrentPosition(res => {
    console.log('获取位置成功!')
    const crd = res.coords
    // 经纬度,在公司会把经纬度发给服务器,计算后返回给前端城市信息,也可以用高德,腾讯地图的共用api
    console.log(`Latitude(纬度) : ${crd.latitude}`);
    console.log(`Longitude(经度): ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
  }, err => {
    console.log('获取位置失败')
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  })
}

// 获取现在的城市
const cityStore = useCityStore()
const { currentCity } = storeToRefs(cityStore)

// 日期自动格式化
const nowDate = new Date()
// 新的天数这样加,不要直接new Date()+1,防止出现'7月32日'
const newDate = new Date()
newDate.setDate(nowDate.getDate() + 1) // 不返回新的值,直接改原对象
// 开始日期,结束日期,停留日期
const startDate = ref(formatMonthDay(new Date()))
const endDate = ref(formatMonthDay(newDate))
const stayCount = ref(1)
stayCount.value = getDiffDays(nowDate, newDate) // 可有可无,默认就是1天

// 日历
const isCalendarShow = ref(false)
// 组件自带,确定按钮事件处理函数
const onConfirm = (value) => { // 日历区间默认参数value->数组[开始,结束]
  // console.log(value) 
  // 格式化入住,离开事件
  startDate.value = formatMonthDay(value[0])
  endDate.value = formatMonthDay(value[1])
  // 计算天数差值
  stayCount.value = getDiffDays(value[0], value[1])
  // 关闭日历
  isCalendarShow.value = false
}

// 获取热门建议的store数据
const homestore = useHomeStore()
homestore.fetchHotSuggests()
const {hotSuggests} = storeToRefs(homestore)
// hotSuggests是ref类型的数据了,直接打印获取和之前的数据不一样了
// console.log(hotSuggests)

// 搜素功能
const searchBtn = () => {
  router.push({
    path:'/search',
    query: { // ref数据传值要.value
      startDate: startDate.value,
      endDate: endDate.value,
      currentCity: currentCity.value.cityName
    }
  })
}

</script>



<style scoped>
.home-sea-box {
  /* 日历底色 */
  --van-calendar-popup-height: 100%;


  /* 定位 */
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

      img{
        margin-left: 5px;
        width: 18px;
        height: 18px;
      }
    }
  }

  /* 选择日期 */
  .section {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 0 20px;
    color: #999;
    height: 44px;

    .start {
      flex: 1;
      display: flex;
      height: 44px;
      align-items: center;
    }

    .end {
      min-width: 30%;
      padding-left: 20px;
    }

    .date {
      display: flex;
      flex-direction: column;

      .tip {
        font-size: 12px;
        color: #999;
      }

      .time {
        margin-top: 3px;
        color: #333;
        font-size: 15px;
        font-weight: 500;
      }
    }
  }

  .date-range {
    height: 44px;

    .stay {
      flex: 1;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
  }

  /* 价格/人数选择/关键字 */
  .price-counter {
    .start {
      border-right: 1px solid var(--line-color);
    }
  }
  .hot-suggests {
    margin: 10px 0;
    height: auto;

    .item {
      padding: 4px 8px;
      margin: 4px;
      border-radius: 14px;
      font-size: 12px;
      line-height: 1;
    }
  }

  /* 地区推荐 */
  .hot-suggests{
    margin: 10px 0;
    .item{
      padding: 4px 8px;
      border-radius: 14px;
      margin: 3px;
      font-size: 12px;
    }
  }

  /* 开始搜索 */
  .search-btn {
    .btn {
      width: 342px;
      height: 38px;
      max-height: 50px;
      font-weight: 500;
      font-size: 18px;
      line-height: 38px;
      text-align: center;
      border-radius: 20px;
      color: #fff;
      background-image: var(--theme-linear-gradient);
    }
  }
}
</style>
