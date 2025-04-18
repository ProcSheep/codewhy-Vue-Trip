# vue-demo练习
## 项目准备工作(*)
### 项目目录和别名@
- 1.创建vite文件目录: 
  - pubilc: ==静态资源 图片存放优选,默认`/`开头自动访问到public文件夹==
  - src内部:
    - assets: 静态css,data数据
    - components: 抽取组件,例如:tabbar sidebar
    - ==hooks==: 封装通用方法
    - ==mock==: 测试数据
    - router: 路由
    - ==service==: 网络请求
    - store: pinia状态管理,/modules为不同的store
    - utils: 工具方法(函数) format等
    - views: 页面组件vue
  - ==jsconfig.json==: codewhy的文件,提供更好的提示,推荐别的项目也用
- 2.package.json内部可以看启动命令,已经配置启动命令`npm run dev`和打包命令`npm run build`
- 3.==**配置别名**==: 下载`npm i @vitejs/plugin-vue`, 然后引入path并配置
  ```js
    // vite.config.js内部分代码
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  ```
  > @: 代表绝对路径下的src路径,以后配置src下的文件可以直接@代替,例如`@/componets/tabbae/tabbar.vue`
### css重置
- css重置:
  - ==normalize.css: 重置css的第三方库== 
  - reset.css: 自己写的css重置内容
- 1.下载: `npm i normalize.css`,直接引入main.js即可使用
- 2.==配置assets/css内的文件==
  - 配置reset.css(自定义重置css文件)和common.css(公共css文件),这里不再展示具体css内容
  - ==统一目录index.css==
  ```css
    /* 引入别的css使用@import */
    @import "./common.css";
    @import "./reset.css";
  ```

- ==3.把两个css文件引入main.js文件==
  ```js
    import 'normalize.css'
    // index.css代理了assets/css内的所有css文件
    import './assets/css/index.css'
  ```
### 配置路由router
- 下载: `npm i vue-router`
- 1.router/index.js配置路由
  ```js
    import {createRouter,createWebHashHistory} from 'vue-router'

    const router = createRouter({
      history: createWebHashHistory(),
      routes: [
        {
          path: "/",
          redirect: "/home"
        },
        {
          path: "/home",
          component: ()=> import("@/views/home/home.vue")
        },
        {
          path: "/favor",
          component: ()=> import("@/views/favor/favor.vue")
        },
        {
          path: "/message",
          component: ()=> import("@/views/message/message.vue")
        },
        {
          path: "/order",
          component: ()=> import("@/views/order/order.vue")
        },
      ]
    })

    export default router
  ```
  > 1.Hash模式路由
  > 2.路由懒加载
  > 3.路由'/'重定向
  > 4.导出配置好的路由router
  > 5.==对应的路由文件已经按照上面的路径创建完成==
- 2.main.js注册路由
  ```js
    import router from './router/index'
    
    createApp(App)
    .use(router) // 注册路由
    .mount('#app')
  ```
- 3.路由文件的显示
  ```html
    <template>
      <div>
        <!-- 给别的vue页面显示的位置 -->
        <RouterView></RouterView>
        我的App页面
      </div>
    </template>

    <script setup>
      
    </script>

    <style scoped>

    </style>
  ```
  > `<RouterView></RouterView>`给别的vue页面显示的位置,即路由配置router里面的那些vue页面 
### 配置公共状态pinia
- 状态管理pinia的配置: `npm i pinia`
- 1.创建store/index.js
  ```js
    import {createPinia} from 'pinia'

    const pinia = createPinia()

    export default pinia
  ```
- 2.在main.js中引入pinia
  ```js
    import pinia from './store/index'

    createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app')
  ```
- 3.示例创建一个公共状态管理store
- 在store下新建module文件夹,内部放各个store代码
  ```js
    // /store/modules/search.js
    import {defineStore} from 'pinia'

    const useSearchStore = defineStore("search",{
      state: ()=>{
        
      },
      actions:{

      }
    })

    export default useSearchStore
  ```
  > 别的vue想要用这个store,直接import引入这个useSearchStore即可
### hooks与utils的分工
- hooks和utils看似相似的,都是封装工具函数的,但是双方职能完全不同
- ==**hooks**== 
  Vue 3 里复用有状态逻辑的方式，它可以使用 Vue 的响应式系统，==如 ref、reactive、watch 等。hooks 通常和组件的状态、生命周期等相关。
- ==适用场景==
  状态管理：封装需要响应式数据的逻辑，比如表单状态管理。
  生命周期钩子：封装和组件生命周期相关的逻辑，例如在组件挂载时获取数据。
  事件监听：封装事件监听逻辑，例如监听窗口大小变化。
- ==**utils**==
  utils 文件夹通常用于存放通用的、和 Vue 响应式系统以及组件逻辑无关的工具函数。这些函数可以在项目的任何地方使用，不依赖于 Vue 的特定功能。
- ==适用场景==
  数据处理：对数据进行格式化、转换、验证等操作。
  日期和时间处理：如日期格式化、计算时间差等。
  字符串处理：字符串的截取、替换、拼接等。
  数学计算：实现一些通用的数学公式。
## 页面搭建
### Tabbar搭建
- 底部tabbar搭建,点击对应图标后,图标变色并跳转到对应的文件
- 方便书写,使用for循环,提前封装数据
  ```js
    // /assets/data/tabbar.js
    export const tabbarData = [
      {
        text: "首页",
        image: "tabbar/tab_home.png",
        imageActive:"tabbar/tab_home_active.png",
        path: "/home"
      },
      {
        text: "收藏",
        image: "tabbar/tab_favor.png",
        imageActive:"tabbar/tab_favor_active.png",
        path: "/favor"
      },
      {
        text: "订单",
        image: "tabbar/tab_order.png",
        imageActive:"tabbar/tab_order_active.png",
        path: "/order"
      },
      {
        text: "消息",
        image: "tabbar/tab_message.png",
        imageActive:"tabbar/tab_message.png",
        path: "/message"
      }
    ]
  ```
- ==tabbar属于组件类==,/components/tabbar/tabbar.vue
  ```html
    <template>
      <div>
        <div class="tabbar">
          <!-- v-for循环,记得加key值 -->
          <template v-for="(item, index) in tabbarData" :key="item.path">
            <div 
              class="tabbarItem" 
              :class="{active: currentIndex === index}" 
              @click="itemClick(index,item)"
            >
              <img v-if="currentIndex !== index" class="img" :src="getImgURL(item.image)" alt="">
              <img v-else class="img" :src="getImgURL(item.imageActive)" alt="">
              <span class="text">{{ item.text }}</span>
            </div>
          </template>
        </div>
      </div>
    </template>

    <script setup>
    import { tabbarData } from '@/assets/data/tabbar.js'
    import { getImgURL } from '@/utils/load_image.js'
    import { ref } from 'vue';
    import {useRouter} from 'vue-router'

    // 现在点击的tabbar栏的索引
    const currentIndex = ref(0)
    // 等于$router
    const router = useRouter()
    const itemClick = (index,item)=>{
      currentIndex.value = index 
      router.push(item.path) // 跳转到某个路由
    }
    </script>
  ```
- getImgURL函数(utils)
  ```js
    export const getImgURL = (image) => {
      return `/img/${image}`
    }
  ```
  > 1.图标的切换依据currentIndex是否等于index,每次点击触发itemClick函数,此函数会修改currentIndex的值,这个值是响应式数据,所以会重新渲染dom树,此时两个v-if-else会根据新的currentIndex的值去计算,然后显示对应的图片,只有index等于curIndex时,才会显示颜色图标
  > 2.静态资源图片存储在public中,通过`/`,可以直接访问到/public文件夹,然后根据目录路径拼接后面的url即可
  > 3.上面:class的active是改变字体颜色的,active的css样式是橙色color,具体逻辑和图片一样,计算curIndex和index是否相等,相等就启用active
  > ==重点在于学会vue的渲染,v-for和v-if结合,响应式数据思维==
- 最后记得在App.vue中引入tabbar组件
  ```html
    <template>
      <div>
        <RouterView></RouterView>
        <TabBar></TabBar>
      </div>
    </template>

    <script setup>
      import TabBar from "@/components/tabbar/tabbar.vue";
    </script>

    <style scoped>

    </style>
  ```
### 页面内容防遮挡(*)
- Tabbar菜单栏fixed固定在底部,当页面内容超出100vh时,Tabbar页面会遮挡一部分页面内容,如下操作即可
  ```html
    <div>
      <div class="page-content">
        <RouterView></RouterView>
      </div>
      <TabBar v-if="!route.meta.hideTabbar"></TabBar>
    </div>
  ```
  ```css
    /* 防止Tabbar遮挡页面 */
    .page-content{
      /* Tabbar固定高度55px */
      margin-bottom: 55px;
    }
  ```
### 补充less知识点(*)
- tabbar代码中的less
- ==补充: less的语法==
  - 全局定义的变量:root
  - &.的含义
  ```css
    .tabbarItem {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      /* &代表父类,即当.tabbarItem .active联合时,会采用下面的css */
      &.active{
        color: var(--primary-color);
      }
    }
  ```
  > --primary-color是一个变量(less),定义:root中,这次定义在common.css文件中,因为它之前引入给main.js,所以全局都可用
  ```css
    /* /assets/common.css */
    :root{
      --primary-color: #ff9584;
    }
  ```
### UI库
- 类型一: 后台管理系统
  - Element-UI(Vue2)/Element-Plus(Vue3)
- 类型二: 小程序
  - Vant Weapp
- 类型三: 移动端web
  - Vant UI
- 类型四: 网易/知乎/bili(前两个是react,b站是vue)
  - Element-Plus 
  - 国外的(==风格简约==)
    - Material-UI (React优秀组件库)
    - Vuetify (Vue优秀组件库)
### 组件库自定义样式(*)
- 使用自定义组件时,一定仔细看文档,内部的属性等下面都会有标注
  [![pEfs9Rf.png](https://s21.ax1x.com/2025/04/16/pEfs9Rf.png)](https://imgse.com/i/pEfs9Rf)
  [![pEfspJP.png](https://s21.ax1x.com/2025/04/16/pEfspJP.png)](https://imgse.com/i/pEfspJP)
- ==修改第三方ui库的样式==
- 1.用插槽,插入自己的元素,直接修改即可
  ```html
    <div class="tabbar">
        <!-- v-model负责确定currentIndex的值,点击的索引 -->
        <van-tabbar v-model="currentIndex">
        <template v-for="(item, index) in tabbarData" :key="item.path">
          <van-tabbar-item :to="item.path">
            <span>{{ item.text }}</span>
            <template #icon>
              <img v-if="currentIndex !== index" class="img" :src="getImgURL(item.image)" alt="">
              <img v-else class="img" :src="getImgURL(item.imageActive)" alt="">
            </template>
          </van-tabbar-item>
        </template>
      </van-tabbar>
      </div>
    </div>
  ```
  ```css
    <style lang="less" scoped>
      .tabbar {
        img{
          width: 32px;
        }
      }
    </style>
  ```
  > van-tabbar-item插槽内是自己写的标签,2个img标签+span,所以可以直接css修改
- 2.全局定义一个变量,覆盖它的值 common.css
  ```css
   :root{
      --van-tabbar-item-active-color: #ff9584 !important;
      --van-tabbar-item-font-size: 20px !important;
    }

  ```
- 3.局部定义一个变量,覆盖它的值(影响小)
  ```css
  .tabbar{
    --van-tabbar-item-active-color: #ff9584 !important;
    --van-tabbar-item-font-size: 20px !important;
  }
  ```
  > 在本页面的文件内直接修改,不会影响全局,别的页面使用tabbar组件也不会被影响到
- ==寻找组件变量/**官方文档也会有**/==
  [![pEfsCz8.png](https://s21.ax1x.com/2025/04/16/pEfsCz8.png)](https://imgse.com/i/pEfsCz8)
- 4.==**直接找到对应的子组件的选择器,修改需要:deep(className),子组件的选择器**==
- 每一个style属性都加scoped属性,这是限制css作用域的,如果直接给组件的class上css属性是不行的,组件内部的style也有自己的scoped,所以要使用:deep,==对子组件选择器执行渗透,可以无视这个子组件内部scoped,直接修改属性==
  ```css
    <style lang="less" scoped>
      .tabbar {
        :deep(.van-tabbar-item){
          font-size: 25px;
          color: red;
        }
      }
    </style>
  ```
  > 直接对tabbar组件内部的css属性进行修改,.van-tabbar-item是它的class名字
  > vue使用第三方库都会用到这个方法
### Navbar搭建
- 开始搭建home页面,搭建主页面的顶部Navbar组件
- 可以在view/home文件夹内再新建cpns(components),创建home-navbar.vue,负责显示顶部Navbar
  ```html
    <!-- home-navbar.vue -->
    <template>
      <div class="home-nav">
        <div class="nav-bar">
          <div class="title">宏源旅途</div>
        </div>
      </div>
    </template>
  <!-- css略 -->
  ```
- 直接引入home.vue,同时配置home.vue的banner(非轮播图片,不单独封装组件了)
  ```html
    <!-- home.vue -->
    <template>
      <div class="home">
        <!-- 2种写法都行 -->
        <!-- <HomeNavbar/> -->
        <home-navbar/>
        <div class="banner">
          <img src="/img/home/banner.webp" alt="">
        </div>
      </div>
    </template>

    <script setup>
      // 引入HomeNavbar组件
      import HomeNavbar from './cpns/home-navbar.vue'
    </script>
  ```
### 定位功能组件
- 定位组件,放入home的cpns
  ```html
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

    // 1.跳转到位置/城市页面 
    const goCity = () =>{
      router.push('/city')
    }

    // 2.获取地理位置
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
  ```
  > 1.第一个事件,跳转city页面(自行创建页面并注册路由)
  > 2.第二个事件,这个是js的api,看着文档会用即可
### tabbar组件的显示
- 比如,主页的home页面是显示tabbar组件的,但是跳转的city页面不显示,如何动态地显示与不显示它
- 方法1: 路由注册+meta
  [![pEfgf4s.png](https://s21.ax1x.com/2025/04/16/pEfgf4s.png)](https://imgse.com/i/pEfgf4s)
- 方法2: 全局css
  [![pEfgWNj.png](https://s21.ax1x.com/2025/04/16/pEfgWNj.png)](https://imgse.com/i/pEfgWNj)
### city页面
- ==简单地应用vant的组件==
- 搜索search和Tab标签页
  ```html
    <template>
      <!-- <div class="city top-page"> -->
      <div class="city">
        <van-search v-model="value" placeholder="城市/区域/位置" show-action @cancel="onCancel" />
        <!-- tabActive绑定点击索引(0开始) -->
        <van-tabs v-model:active="tabActive">
          <van-tab title="国内-港澳台">内容 1</van-tab>
          <van-tab title="海外">内容 2</van-tab>
        </van-tabs>
      </div>
    </template>

    <script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    const router = useRouter()

    const tabActive = ref()

    const onCancel = () => {
      router.back()
    }
    </script>
  ```
  > 全部是自定义的组件,添加了部分属性,自带的
  > common.js中自定义了Tab组件底边颜色的样式,less变量方法(略)
### 网络请求架构(*)
- 下载:`npm i axios`
- axios封装 /service/request/index.js (==代码略==)
- 配置基础常量 /service/request/config.js
  ```js
    // 任意一个即可
    const BASE_URL = 'http://codercba.com:1888/api'
    // const BASE_URL = 'http://123.207.32.32:1888/api'
    const TIMEOUT = 10000
    export {
      BASE_URL,
      TIMEOUT
    }
  ```
  > 配置基础路径和延时
- 配置模块代码 /service/modules/city.js
  ```js
    import hyRequest from "../request";
    export function getCityAll() {
      return hyRequest.get({
        url: "/city/all",
      });
    }
  ```
  > 统一维护city页面的网络请求,后期代码多了也好维护
  > 其他的页面网络请求同理
- 配置统一导出 /service/index.js
  ```js
    // 导出modules/city内部的所有函数
    export * from './modules/city'
  ```
  > 主要方便vue页面导入这些网络请求,index.js默认不写,导入直接`@/service`即可,如下
- city.vue
  ```js
    import { getCityAll } from '@/service';
    getCityAll().then(res => console.log(res))
  ```
- 结构图
  [![pEh95Gj.png](https://s21.ax1x.com/2025/04/16/pEh95Gj.png)](https://imgse.com/i/pEh95Gj)
- ==2.新的封装,把vue中网络请求放入store中==
- vue文件中直接网络请求的缺点
  - 1.代码冗余,有很多对网络请求的数据处理代码
  - 2.许多子组件需要网络请求的数据,但是只用一次,使用props有点麻烦
- store/modules/city.js,处理city页面的store
  ```js
    import { getCityAll } from '@/service'
    import {defineStore} from 'pinia'

    const usecityStore = defineStore("city",{
      state: ()=>({
        allCities:{} // 保存城市数据
      }),
      actions:{
        async fetchAllCitiesData(){
          const res = await getCityAll() // 请求城市数据
          this.allCities = res.data
        }
      }
    })

    export default usecityStore
  ```
  > 此时actions内的函数不会自动运行,引入store时记得运行
- city.vue
  ```js
  import { useRouter } from 'vue-router';
  // 使用store
  const cityStore = usecityStore()
  cityStore.fetchAllCitiesData() // 调用里面的函数,获取城市数据
  const {allCities} = storeToRefs(cityStore) // 使得allCities具有响应式
  ```
  > ==注意获取响应式数据时不要只解构,会失去响应式,要storeToRefs处理store==
- ==总结如下图==
  [![pEh9IRs.png](https://s21.ax1x.com/2025/04/16/pEh9IRs.png)](https://imgse.com/i/pEh9IRs)
- 3.数据处理,v-for对象
  ```html
    <van-tabs v-model:active="tabActive">
      <template v-for="(value,key,index) in allCities" :key="key">
        <van-tab :title="value.title"></van-tab>
      </template>
    </van-tabs>
  ```
  > 这样数据如何改动,数量变多变少都不影响,比起直接allCities.XXX.XXX方便的多
### tab与滚动条的布局(*)
- 方案1: tabbar固定,content超出后自动带滚动条,需要margin-top留出tabbar的位置
- ==缺点: 全页面滚动条==
  ```css
    .top{
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
    }

    .content{
      /* tabbar 固定高度 98px*/
      margin-top: 98px;
    }
  ```
  [![pEhZTSS.png](https://s21.ax1x.com/2025/04/16/pEhZTSS.png)](https://imgse.com/i/pEhZTSS)
- ==(**选它**)方法2: 局部滚动,但是需要content有自己的高度==
  ```css
    .content{
      /* tabbar 固定高度 98px*/
      height: calc(100vh - 98px);
      overflow-y: auto;
    }
  ```
### city数据处理(*)
- 学习数据处理的方法,获取城市数据如下 ==allCities==
  [![pEhZ7Qg.png](https://s21.ax1x.com/2025/04/16/pEhZ7Qg.png)](https://imgse.com/i/pEhZ7Qg)
  ```js
    // 遍历数据的方式
    allCities.cityGroup.title // 太死板
    allCities['cityGroup'] // 如果把内部的数据变为响应式,就很灵活
  ```
- vant组件正好提供了这个api
  ```html
    <!-- tabActive是索引值 -->
    <van-tabs v-model:active="tabActive">
        <template v-for="(value,key,index) in allCities" :key="key">
          <!-- 看文档,name属性可以固定tab标签的索引值 -->
          <van-tab :title="value.title" :name="key"></van-tab>
        </template>
  </van-tabs>
  ```
  > tabs的tabActive是tab索引的值,而tab的name属性可以更改索引的值,所以在遍历allCities数据的时候把key值赋值给name,这个key值就是遍历allCities对象的'cityGroup'和'cityGroupOverSea',所以tabActive动态获取到了它们的值
- ==响应式地获取对应栏的数据==
  ```js
    // 国内-港澳台和海外的整体数据
    // allCities经过storeToRefs转化已经为ref类型数据了,需要加value 
    // 使用key值直接从allCities中获取的数据是没有响应式的,所以用计算属性,一旦计算属性内部依赖的值发生改变就会重新计算
    let currentGroup = computed(()=> allCities.value[tabActive.value])
    // let currentGroup = allCities.value[tabActive.value] X
  ```
- 打印测试是否获取到了数据(==切换变到对应的数据==)
  ```html
    <div class="content">
      <!-- 异步获取的数据,开始为undefined,用? -->
      <template v-for="item in allCities[tabActive]?.cities">
        <div>{{ item }}</div>
      </template>
    </div>
  ```
### city数据展示
- 先展示再封装,数据比较复杂,认真理理
  ```html
    <div class="content">
      <!-- 异步获取的数据,开始为undefined,用? -->
      <template v-for="(group,index) in allCities[tabActive]?.cities" :key="index">
        <div class="group-title">{{ group.group }}</div>
        <template v-for="(city,indey) in group.cities" :key="indey">
          <div class="cityName">{{ city.cityName }}</div>
        </template>
      </template>
    </div>
  ```
  [![pEheTtx.png](https://s21.ax1x.com/2025/04/16/pEheTtx.png)](https://imgse.com/i/pEheTtx)
- 封装组件 /cpns/city-group.vue
  ```html
    <template>
      <!-- 已经选好了哪个板块了,直接传递的板块数据,groupData有默认值,所以不用? -->
      <template v-for="(group, index) in groupData.cities" :key="index">
        <div class="group-title">{{ group.group }}</div>
        <template v-for="(city, indey) in group.cities" :key="indey">
          <div class="cityName">{{ city.cityName }}</div>
        </template>
      </template>
    </template>

    <script setup>
    defineProps({
      groupData: {
        type: Object,
        default: {}
      }
    })
    </script>
  ```
- city.vue
  ```html
    <div class="content">
      <cityGroup :group-data="currentGroup"></cityGroup>
    </div>
  ```
  > 记得引入组件,currentGroup是单个板块的数据,已经区分过了
### IndexBar组件
- 开箱即用
  ```html
    <van-index-bar>
      <template v-for="(group, index) in groupData.cities" :key="index">
        <van-index-anchor :index="group.group" />
        <template v-for="(city, indey) in group.cities" :key="indey">
          <van-cell :title="city.cityName" />
        </template>      
      </template>
    </van-index-bar>
  ```
### 优化city渲染(*)
- 一次性渲染两个组件的数据,切换时只是显式对应的组件(v-show),这样速度更快,不用重新渲染
- 之前是替换currentGroup的数据,依据响应式重新渲染,数据多,比较慢
  ```html
    <div class="content">
      <template v-for="(value,key,index) in allCities" :key="index">
        <cityGroup v-show="tabActive === key" :group-data="value"></cityGroup>
      </template>
    </div>
  ```
### 阶段总结
- city页面本身不难,组件节省了很多工夫,但是数据比较复杂,所以需要认真处理好数据的循环
### 热门城市
- city-group.vue
- ==1.热门城市和处理城市数据一样,十分简单==
  ```html
    <!-- :index-list映射索引列表 -->
    <van-index-bar :index-list="indexList">
      <!-- 热门 -->
      <van-index-anchor index="热门" />
      <div class="list">
        <template v-for="(item, index) in groupData.hotCities" :key="index">
          <!-- <van-cell :title="item.cityName" /> -->
          <div class="hotCitiesItem" @click="selectCity(item)">{{ item.cityName }}</div>
        </template>
      </div>
      <!-- 索引表 -->
      <template v-for="(group, index) in groupData.cities" :key="index">
        <van-index-anchor :index="group.group" />
        <template v-for="(city, indey) in group.cities" :key="indey">
          <van-cell :title="city.cityName" @click="selectCity(city)" />
        </template>      
      </template>
    </van-index-bar>
  ```
  > 在基础城市上面再做一个for循环,然后配置好样式
- ==2.右侧索引的处理==
- IndexBar的索引是依据顺序自动配置的,依据文档,可以通过van-index-bar的index-list配置索引有谁,这里动态配置,给热门数据单独配置`*`,其余的由cities.group动态获取,减少一些不必要的首字母(例如,没有城市的拼音首字母开头是V)
  ```js
    // 获取城市的分组信息
    const indexList = computed(() => {
      const list = props.groupData.cities.map(item => item.group)
      // 额外给热门加一个索引*
      list.unshift('*')
      return list
    })
  ```
### 主页热门城市回显(*)
- 主页面需要城市数据的组件可能比较多,单纯传递数据比较麻烦,可以使用事件总线,统一发出,谁用谁监听,==不过最简单的,还是依据citystore统一处理数据==
- city.store
  ```js
    state: ()=>({
      allCities:{},
    + currentCity: {
        cityName: '北京'
      }
    })
  ```
- 在城市页面获取到城市数据,然后放入citystore中
- 上面html代码中,已经配置了selectCity事件监听
  ```js
    // 监听城市点击
    const selectCity = (city) => {
      // -> city store
      cityStore.currentCity = city
      // 返回上一级
      router.back()
    }
  ```
  > 这里selectCity事件监听一个监听自己的div,一个监听vant组件van-cell,是否能监听组件取决于组件内部对于监听事件的设置,后面会讲
- home页面回显城市名 home-search-box.vue
  ```js
    const cityStore = usecityStore()
    const { currentCity } = storeToRefs(cityStore) // 现在的城市
  ```
  > 把currentCity放到对应html位置
  
### 日期处理dayjs(*)
- ==有关日期的处理,推荐用dayjs库即可==
- 下载: `npm i dayjs`
- 写好酒店选日期的html和css样式,略(home-search-box.vue)
- 计算开始时间,结束时间,stay时间
  ```js
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
  ```
- ==dayjs计算日期封装进utils==
  ```js
    import dayjs from 'dayjs'
    // 格式化月日
    export function formatMonthDay(date){
      return dayjs(date).format('MM月DD日')
    }
    // 计算日期差值(天)
    export function getDiffDays(startDate,endDate){
      return dayjs(endDate).diff(startDate,'day')
    }
  ```
### 日历组件
- 简单使用日历组件,简单修改css样式(less变量)和样式配置,略
- 复用dayjs日期差值计算的函数
  ```html
    <!-- 日历 -->
    <van-calendar class="calendar" v-model:show="isCalendarShow" type="range" @confirm="onConfirm" color="#ff9527" />
  ```
  ```js
    // 日历
    const isCalendarShow = ref(false)
    // 组件自带,确定按钮事件处理函数
    const onConfirm = (value) => { // 日历区间默认参数value->数组[开始,结束]
      // 格式化入住,离开事件
      startDate.value = formatMonthDay(value[0])
      endDate.value = formatMonthDay(value[1])
      // 计算天数差值
      stayCount.value = getDiffDays(value[0], value[1])
      // 关闭日历
      isCalendarShow.value = false
    }
  ```
### 城市热门数据
- 城市热门数据也是service网络请求,store保存数据,然后vue直接引入,前面网络架构学过了,完全一致
- 看文件目录即可,代码略

### 行高行距问题(*)
- normalize.css中把html的line-height设置为1.15,在页面元素没有设置行高时,默认font-size*1.15就是它的行高; 行高分配是,行高减去字体高度,然后在字体上下平分,实现纵向居中,浏览器不会显示带小数px间距,所以有时候,比如剩余1.8px,可能上边1px,下面0.8px(小数省略了),最终只有上面1px,下面0px;
- 在页面放大缩小时,浏览器重新记录px,有时候缩放后,剩余px可能正好整除,所以显示又正常了(居中)  
- ==解决: 可以重置reset.css,不建议设置为1(紧紧包裹文字,不美观),可以设置为1.2(浏览器通用)==

### 位置信息问题
- 可以使用腾讯和高德的SDK,使用它们的服务器处理你的经纬度,返回对应的城市位置等  
### 搜索跳转与query传参
- 搜索按钮,传递当前城市的参数
- 搜索页面的创建和路由,略
  ```html
    <!-- 开始搜索 -->
    <div class="section search-btn" @click="searchBtn">
      <div class="btn">开始搜索</div>
    </div>
  ```
  ```js
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
  ```
### 分类管理搭建
- 分类组件的数据请求依据'网络请求架构'里的思路,存入store
- 在新的home组件中,获取数据,简单配置样式即可
  ```js
    import useHomeStore from '@/store/modules/home';
    import { storeToRefs } from 'pinia';

    // 获取数据
    const homestore = useHomeStore()
    homestore.fetchCategories()
    const { categories } = storeToRefs(homestore)
  ```
### 客房列表搭建
- 新组件: home-content
  [![pE4pydO.png](https://s21.ax1x.com/2025/04/18/pE4pydO.png)](https://imgse.com/i/pE4pydO)
- 依据discoveryContentType来确定客房的html和css布局,有2种样式,==,封装进公共组件/components/home==
  ```html
    <div class="home-content">
    <div class="title">热门精选</div>
    <!-- 客房列表,分两种类型 -->
    <div class="list">
      <template v-for="(item,index) in houseList" :key="item.data.houseId">
        <!-- 样式不同显示不同的组件 -->
        <HouseItemV9 v-if="item.discoveryContentType === 9" :item-data="item.data"/>
        <HouseItemV3 v-if="item.discoveryContentType === 3" :item-data="item.data"/>
      </template>
    </div>
  </div>
  ```
  > 具体两个组件就不展示了,获取到父传子的数据后,配置html和css即可
  > 部分数据需要`?.`,有的item数据中可能没有一些通用的属性
- params传参,多页page,==客房有多页数据,每次请求新的一页==
- ==注意,请求新的数据要追加,不要覆盖原数据==
- store中负责请求数据,直接在里面操作即可
  ```js
    // state
    currentPage: 1 // 请求页面
    // actions
    async fetchHouseList(){
      const res = await getHouseList(this.currentPage)
      // 不要覆盖之前的数据,追加新数据push
      this.houseList.push(...res.data)
      this.currentPage ++
    }
  ```
  ```js
    export function getHouseList(currentPage){
      return hyRequest.get({
        url: '/home/houselist',
        // 接受page参数
        params:{
          page: currentPage
        }
      })
    }
  ```
### window滚动与加载(*)
- 复习css的三个变量的关系,如下
  [![pE4pseK.png](https://s21.ax1x.com/2025/04/18/pE4pseK.png)](https://imgse.com/i/pE4pseK)
- ==把滚动封装进hooks中,/hooks/useScroll.js==
- ==在hooks中,当滚动到底部时,需要网络请求新数据,有2个方法解决==
  >
- ==方法1:传递函数==
- 毕竟请求网络数据的函数不能写死
  ```js
    import { onMounted, onUnmounted, ref } from 'vue';

    // 方法1: 通过回调函数
    export default function useScroll(cb){
      const scrollListenerHandler = () => {
        const clientHeight = document.documentElement.clientHeight
        const scrollTop = document.documentElement.scrollTop
        const scrollHight = document.documentElement.scrollHeight

        // 防止小数点精确问题(1~2px即可)
        if(scrollTop + clientHeight + 2 >= scrollHight){
          // 执行外边传进来的函数,比如请求houseList的函数
          if(cb) cb()
        }
      }

      onMounted(() => {
        window.addEventListener('scroll',scrollListenerHandler)
      })

      onUnmounted(()=>{
        window.removeEventListener('scroll',scrollListenerHandler)
      })
    }
  ```
- home.vue
  ```js
    import useScroll from '@/hooks/useScroll';
    // 方法1: 回调函数不易控制
    useScroll(homestore.fetchHouseList)
  ```
  > 传递回调函数不好管理,而且操作起来不一定只需要一个回调函数,所以推荐方法2,变量方法,变量更好操作
- ==方法2: 变量方法==
  ```js
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
  ```
- home.vue
  ```js
    // hooks
    import useScroll from '@/hooks/useScroll';
    // store
    import useHomeStore from '@/store/modules/home';
    const homestore = useHomeStore()

    // 方法2: 推荐变量方法
    const { isReachBottom } = useScroll()
    // 监听isReachBottom的变化,在没有immediate属性下,默认第一次不执行,之后只要变量变化,就执行回调
    // 新变量值作为参数传递给回调函数,当到达底部时,newValue=true,请求新的数据
    watch(isReachBottom, (newValue) => {
      if (newValue) {
        // 更严谨,在确定请求数据成功后在设置'未到达底部'
        homestore.fetchHouseList().then(() => {
          // 获取的isReachBottom是ref类型
          isReachBottom.value = false
        })
      }
    })
  ```
  > 后续优化,比如节流函数,控制监听频率,针对keep-alive的情况,需要新的window监听