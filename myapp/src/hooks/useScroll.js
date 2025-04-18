import { onMounted, onUnmounted, ref } from 'vue';

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
  const scrollListenerHandler = () => {
    const clientHeight = document.documentElement.clientHeight
    const scrollTop = document.documentElement.scrollTop
    const scrollHight = document.documentElement.scrollHeight

    // 防止小数点精确问题(1~2px即可)
    if(scrollTop + clientHeight + 2 >= scrollHight){
      isReachBottom.value = true
    }
  }

  // 在页面创建与销毁时,创建和销毁对应的监听事件,window监听事件不销毁,是会一直保留的!
  onMounted(() => {
    window.addEventListener('scroll',scrollListenerHandler)
  })

  onUnmounted(()=>{
    window.removeEventListener('scroll',scrollListenerHandler)
  })

  return {isReachBottom}
}
