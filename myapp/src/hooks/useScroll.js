import { onActivated, onMounted, onUnmounted, ref } from 'vue';
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

// 2.方法2: 变量返回 , 可以传入监听的元素
export default function useScroll(elRef){
  let el = window // 默认监听window
  const isReachBottom = ref(false) // 是否到达底部
  // 更好的响应式,外界可以自由获取更多数据
  const clientHeight = ref(0)
  const scrollTop = ref(0)
  const scrollHight = ref(0)
  // 节流函数throttle
  const scrollListenerHandler = throttle(() => {
    // console.log('正在监听滚动')
    if(el === window){
      clientHeight.value = document.documentElement.clientHeight
      scrollTop.value = document.documentElement.scrollTop
      scrollHight.value = document.documentElement.scrollHeight
    }else{
      // 获取元素的数据
      clientHeight.value = el.clientHeight
      scrollTop.value = el.scrollTop
      scrollHight.value = el.scrollHeight
    }
    
    // 防止小数点精确问题(1~2px即可)
    if(scrollTop.value + clientHeight.value + 2 >= scrollHight.value){
      isReachBottom.value = true
    }
  },100) // 100ms

  // 在页面创建与销毁时,创建和销毁对应的监听事件,window监听事件不销毁,是会一直保留的!
  onMounted(() => {
    if(elRef){ // 如果有传入元素,就监听这个元素
      el = elRef.value 
    }
    el.addEventListener('scroll',scrollListenerHandler)
  })

  onUnmounted(()=>{
    el.removeEventListener('scroll',scrollListenerHandler)
  })

  return {isReachBottom,clientHeight,scrollHight,scrollTop}
}
