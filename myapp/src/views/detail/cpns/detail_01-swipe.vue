<template>
  <div class="swipe">
    <van-swipe class="swipe-list" :autoplay="3000" indicator-color="white" lazy-render>
      <!-- 基础的轮播图item -->
      <template v-for="(item, index) in swipeData" :key="index">
        <van-swipe-item class="item">
          <img :src="item.url" alt="">
        </van-swipe-item>
      </template>
      <!-- 自定义指示器,作用域插槽 + 具名插槽(indicator) -->
      <!-- 内部数据: active(当前item索引) total(数组总数) -->
      <template #indicator="{ active, total }">
        <div class="indicator">
          <!-- 循环对象swipeGroup -->
          <template v-for="(value,key,index) in swipeGroup" :key="key">
            <!-- 被选中的轮播图类可以获取active的css样式,key是字符串,数据是Num -->
            <span class="item" :class="{active: swipeData[active]?.enumPictureCategory == key}">
              <span class="text">{{ getName(value[0].title) }}</span>
              <!-- 被选中的类才会显示数量 -->
              <span class="count" v-if="swipeData[active]?.enumPictureCategory == key">
                <!-- 获取当前组里的索引,而不是所有数据的索引 -->
                {{ getCategoryIndex(swipeData[active]) }} / {{ value.length }}
              </span>
            </span>
          </template>
        </div>
      </template>
    </van-swipe>
  </div>
</template>

<script setup>
const props = defineProps({
  swipeData: {
    type: Array,
    default: () => []
  }
})

// 处理数据---分类
const swipeGroup = {}
// 思路1: 2次循环,第一次确定有哪些类(例如: "2": []),第二次,往对应类的数组里面存放item
// for(const item of props.swipeData){
//   swipeGroup[item.enumPictureCategory] = [] // 相同的key会合并
// }
// for(const item of props.swipeData){
//   const valueArray = swipeGroup[item.enumPictureCategory]
//   valueArray.push(item)
// }

// 思路2: 一次循环
for(const item of props.swipeData){
  let valueArray = swipeGroup[item.enumPictureCategory] // 第一次获取为undefined,swipeGroup是空对象
  if(!valueArray){
    valueArray = []
    swipeGroup[item.enumPictureCategory] = valueArray // 把数组赋值回去
  }  
  valueArray.push(item)
}
// console.log(swipeGroup)

// 转换数据的方法,删除多余的符号
const nameReg = /【(.*?)】/i
const getName = (name) => {
  // 方法1: 替换
  // return name.replace("【","").replace("】","").replace("：","")
  // 方法2: 正则表达式
  const result = nameReg.exec(name)
  return result[1]
}

// 获取数据在当前组的索引,参数是这个数据单项
const getCategoryIndex = (item) => {
  // 找到类
  const valueArray = swipeGroup[item.enumPictureCategory] 
  // 在对应类中,找到和这个类相同的数据单项,返回它的索引 记得+1
  return valueArray.findIndex(data => data === item) + 1
}
</script>

<style lang="less" scoped>
.swipe {
  .swipe-list {
    .item {
      img {
        width: 100%;
      }
    }

    .indicator {
      position: absolute;
      right: 5px;
      bottom: 5px;
      padding: 2px 5px;
      font-size: 12px;
      color: #fff;
      background: rgba(0, 0, 0, 0.3);

      .item{
        margin: 0 3px;

        &.active{
          padding: 0 3px;
          border-radius: 5px;
          background-color: #fff;
          color: #333;
        }
      }
    }
  }
}
</style>