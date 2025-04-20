import { onMounted, onUnmounted, ref } from 'vue';
// 1.全部引入,使用对应的方法 _.XXX
// import _ from 'underscore'
// 2.单独对方法引入
import { throttle } from 'underscore';

// 方法1: 通过回调函数
// export default function useScroll(cb){
//   const scrollListenerHandler = () => {
//     const clientHeight = document.documentElement.clientHeight
//     const scrollTop = document.documentElement.scrollTop
//     const scrollHight = document.documentElement.scrollHeight

//     // 防止小数点精确问题(1~2px即可)
//     if(scrollTop + clientHeight + 2 >= scrollHight){
//       // 执行外边传进来的函数,比如请求houseList的函数
//       if(cb) cb()
//     }
//   }

//   onMounted(() => {
//     window.addEventListener('scroll',scrollListenerHandler)
//   })

//   onUnmounted(()=>{
//     window.removeEventListener('scroll',scrollListenerHandler)
//   })
// }

// 2.方法2: 变量返回
export default function useScroll(){
  const isReachBottom = ref(false) // 是否到达底部
  // 更好的响应式,外界可以自由获取更多数据
  const clientHeight = ref(0)
  const scrollTop = ref(0)
  const scrollHight = ref(0)
  // 节流函数throttle
  const scrollListenerHandler = throttle(() => {
    clientHeight.value = document.documentElement.clientHeight
    scrollTop.value = document.documentElement.scrollTop
    scrollHight.value = document.documentElement.scrollHeight
    // 防止小数点精确问题(1~2px即可)
    if(scrollTop.value + clientHeight.value + 2 >= scrollHight.value){
      isReachBottom.value = true
    }
  },100) // 100ms

  // 在页面创建与销毁时,创建和销毁对应的监听事件,window监听事件不销毁,是会一直保留的!
  onMounted(() => {
    window.addEventListener('scroll',scrollListenerHandler)
  })

  onUnmounted(()=>{
    window.removeEventListener('scroll',scrollListenerHandler)
  })

  return {isReachBottom,clientHeight,scrollHight,scrollTop}
}
