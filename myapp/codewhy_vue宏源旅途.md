# vue-demo 练习

## 项目准备工作(*)
- 注意: 有许多的样式html和css代码没有仔细敲,而是直接复制的,vue的基础还是不牢靠,之前的vue基础课也重构完
### 项目目录和别名@

- 1.创建 vite 文件目录:
  - pubilc: ==静态资源 图片存放优选,默认`/`开头自动访问到 public 文件夹==
  - src 内部:
    - assets: 静态 css,data 数据
    - components: 抽取组件,例如:tabbar sidebar
    - ==hooks==: 封装通用方法
    - ==mock==: 测试数据
    - router: 路由
    - ==service==: 网络请求
    - store: pinia 状态管理,/modules 为不同的 store
    - utils: 工具方法(函数) format 等
    - views: 页面组件 vue
  - ==jsconfig.json==: codewhy 的文件,提供更好的提示,推荐别的项目也用
- 2.package.json 内部可以看启动命令,已经配置启动命令`npm run dev`和打包命令`npm run build`
- 3.==**配置别名**==: 下载`npm i @vitejs/plugin-vue`, 然后引入 path 并配置
  ```js
    // vite.config.js内部分代码
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  ```
  > @: 代表绝对路径下的 src 路径,以后配置 src 下的文件可以直接@代替,例如`@/componets/tabbae/tabbar.vue`

### css 重置

- css 重置:
  - ==normalize.css: 重置 css 的第三方库==
  - reset.css: 自己写的 css 重置内容
- 1.下载: `npm i normalize.css`,直接引入 main.js 即可使用
- 2.==配置 assets/css 内的文件==

  - 配置 reset.css(自定义重置 css 文件)和 common.css(公共 css 文件),这里不再展示具体 css 内容
  - ==统一目录 index.css==

  ```css
  /* 引入别的css使用@import */
  @import "./common.css";
  @import "./reset.css";
  ```

- ==3.把两个 css 文件引入 main.js 文件==
  ```js
  import "normalize.css";
  // index.css代理了assets/css内的所有css文件
  import "./assets/css/index.css";
  ```

### 配置路由 router

- 下载: `npm i vue-router`
- 1.router/index.js 配置路由

  ```js
  import { createRouter, createWebHashHistory } from "vue-router";

  const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      {
        path: "/",
        redirect: "/home",
      },
      {
        path: "/home",
        component: () => import("@/views/home/home.vue"),
      },
      {
        path: "/favor",
        component: () => import("@/views/favor/favor.vue"),
      },
      {
        path: "/message",
        component: () => import("@/views/message/message.vue"),
      },
      {
        path: "/order",
        component: () => import("@/views/order/order.vue"),
      },
    ],
  });

  export default router;
  ```

  > 1.Hash 模式路由 2.路由懒加载 3.路由'/'重定向 4.导出配置好的路由 router
  > 5.==对应的路由文件已经按照上面的路径创建完成==

- 2.main.js 注册路由
  ```js
  import router from "./router/index";

  createApp(App)
    .use(router) // 注册路由
    .mount("#app");
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

  <script setup></script>

  <style scoped></style>
  ```

  > `<RouterView></RouterView>`给别的 vue 页面显示的位置,即路由配置 router 里面的那些 vue 页面

### 配置公共状态 pinia

- 状态管理 pinia 的配置: `npm i pinia`
- 1.创建 store/index.js

  ```js
  import { createPinia } from "pinia";

  const pinia = createPinia();

  export default pinia;
  ```

- 2.在 main.js 中引入 pinia

  ```js
  import pinia from "./store/index";

  createApp(App).use(router).use(pinia).mount("#app");
  ```

- 3.示例创建一个公共状态管理 store
- 在 store 下新建 module 文件夹,内部放各个 store 代码

  ```js
  // /store/modules/search.js
  import { defineStore } from "pinia";

  const useSearchStore = defineStore("search", {
    state: () => {},
    actions: {},
  });

  export default useSearchStore;
  ```

  > 别的 vue 想要用这个 store,直接 import 引入这个 useSearchStore 即可

### hooks 与 utils 的分工

- hooks 和 utils 看似相似的,都是封装工具函数的,但是双方职能完全不同
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

### Tabbar 搭建

- 底部 tabbar 搭建,点击对应图标后,图标变色并跳转到对应的文件
- 方便书写,使用 for 循环,提前封装数据
  ```js
  // /assets/data/tabbar.js
  export const tabbarData = [
    {
      text: "首页",
      image: "tabbar/tab_home.png",
      imageActive: "tabbar/tab_home_active.png",
      path: "/home",
    },
    {
      text: "收藏",
      image: "tabbar/tab_favor.png",
      imageActive: "tabbar/tab_favor_active.png",
      path: "/favor",
    },
    {
      text: "订单",
      image: "tabbar/tab_order.png",
      imageActive: "tabbar/tab_order_active.png",
      path: "/order",
    },
    {
      text: "消息",
      image: "tabbar/tab_message.png",
      imageActive: "tabbar/tab_message.png",
      path: "/message",
    },
  ];
  ```
- ==tabbar 属于组件类==,/components/tabbar/tabbar.vue

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
            <img
              v-if="currentIndex !== index"
              class="img"
              :src="getImgURL(item.image)"
              alt=""
            />
            <img v-else class="img" :src="getImgURL(item.imageActive)" alt="" />
            <span class="text">{{ item.text }}</span>
          </div>
        </template>
      </div>
    </div>
  </template>

  <script setup>
    import { tabbarData } from "@/assets/data/tabbar.js";
    import { getImgURL } from "@/utils/load_image.js";
    import { ref } from "vue";
    import { useRouter } from "vue-router";

    // 现在点击的tabbar栏的索引
    const currentIndex = ref(0);
    // 等于$router
    const router = useRouter();
    const itemClick = (index, item) => {
      currentIndex.value = index;
      router.push(item.path); // 跳转到某个路由
    };
  </script>
  ```

- getImgURL 函数(utils)
  ```js
  export const getImgURL = (image) => {
    return `/img/${image}`;
  };
  ```
  > 1.图标的切换依据 currentIndex 是否等于 index,每次点击触发 itemClick 函数,此函数会修改 currentIndex 的值,这个值是响应式数据,所以会重新渲染 dom 树,此时两个 v-if-else 会根据新的 currentIndex 的值去计算,然后显示对应的图片,只有 index 等于 curIndex 时,才会显示颜色图标 2.静态资源图片存储在 public 中,通过`/`,可以直接访问到/public 文件夹,然后根据目录路径拼接后面的 url 即可 3.上面:class 的 active 是改变字体颜色的,active 的 css 样式是橙色 color,具体逻辑和图片一样,计算 curIndex 和 index 是否相等,相等就启用 active
  > ==重点在于学会 vue 的渲染,v-for 和 v-if 结合,响应式数据思维==
- 最后记得在 App.vue 中引入 tabbar 组件

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

  <style scoped></style>
  ```

### 组件 vant 的 Tabbar(\*)

- 项目中用的这个方法
- 同时改进小 bug,即输入路由对应 tabbar 高亮显示
- 根据文档使用 route 属性(路由模式),再单独处理图标高亮的问题

  ```html
  <div class="tabbar">
    <!-- v-model负责确定currentIndex的值,点击的索引 -->
    <!-- 开启路由模式,tabbar根据路由url自动选择tabItem -->
    <van-tabbar v-model="currentIndex" active-color="#ff9527" route>
      <template v-for="(item, index) in tabbarData" :key="item.path">
        <van-tabbar-item :to="item.path">
          <span>{{ item.text }}</span>
          <template #icon>
            <img
              v-if="currentIndex !== index"
              class="img"
              :src="getImgURL(item.image)"
              alt=""
            />
            <img v-else class="img" :src="getImgURL(item.imageActive)" alt="" />
          </template>
        </van-tabbar-item>
      </template>
    </van-tabbar>
  </div>
  ```

  ```js
  // 监听路由改变,改变currentIndex值,显示对应图标高亮
  const route = useRoute();
  const currentIndex = ref(0);
  watch(route, (newRoute) => {
    const index = tabbarData.findIndex((item) => item.path === newRoute.path);
    if (index === -1) return; // 找不到就停止设置
    currentIndex.value = index;
  });
  ```

  > 原有的路由模式只能处理字体选中,图标的高亮是依据 currentIndex 来的,受组件局限,只能监听路由单独处理

### 页面内容防遮挡(\*)

- Tabbar 菜单栏 fixed 固定在底部,当页面内容超出 100vh 时,Tabbar 页面会遮挡一部分页面内容,如下操作即可
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
  .page-content {
    /* Tabbar固定高度55px */
    margin-bottom: 55px;
  }
  ```

### 补充 less 知识点(\*)

- tabbar 代码中的 less
- ==补充: less 的语法==

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
    &.active {
      color: var(--primary-color);
    }
  }
  ```

  > --primary-color 是一个变量(less),定义:root 中,这次定义在 common.css 文件中,因为它之前引入给 main.js,所以全局都可用

  ```css
  /* /assets/common.css */
  :root {
    --primary-color: #ff9584;
  }
  ```

### UI 库

- 类型一: 后台管理系统
  - Element-UI(Vue2)/Element-Plus(Vue3)
- 类型二: 小程序
  - Vant Weapp
- 类型三: 移动端 web
  - Vant UI
- 类型四: 网易/知乎/bili(前两个是 react,b 站是 vue)
  - Element-Plus
  - 国外的(==风格简约==)
    - Material-UI (React 优秀组件库)
    - Vuetify (Vue 优秀组件库)

### 组件库自定义样式(\*)

- 使用自定义组件时,一定仔细看文档,内部的属性等下面都会有标注
  [![pEfs9Rf.png](https://s21.ax1x.com/2025/04/16/pEfs9Rf.png)](https://imgse.com/i/pEfs9Rf)
  [![pEfspJP.png](https://s21.ax1x.com/2025/04/16/pEfspJP.png)](https://imgse.com/i/pEfspJP)
- ==修改第三方 ui 库的样式==
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
  > van-tabbar-item 插槽内是自己写的标签,2 个 img 标签+span,所以可以直接 css 修改
- 2.全局定义一个变量,覆盖它的值 common.css

  ```css
  :root {
    --van-tabbar-item-active-color: #ff9584 !important;
    --van-tabbar-item-font-size: 20px !important;
  }
  ```

- 3.局部定义一个变量,覆盖它的值(影响小)
  ```css
  .tabbar {
    --van-tabbar-item-active-color: #ff9584 !important;
    --van-tabbar-item-font-size: 20px !important;
  }
  ```
  > 在本页面的文件内直接修改,不会影响全局,别的页面使用 tabbar 组件也不会被影响到
- ==寻找组件变量/**官方文档也会有**/==
  [![pEfsCz8.png](https://s21.ax1x.com/2025/04/16/pEfsCz8.png)](https://imgse.com/i/pEfsCz8)
- 4.==**直接找到对应的子组件的选择器,修改需要:deep(className),子组件的选择器**==
- 每一个 style 属性都加 scoped 属性,这是限制 css 作用域的,如果直接给组件的 class 上 css 属性是不行的,组件内部的 style 也有自己的 scoped,所以要使用:deep,==对子组件选择器执行渗透,可以无视这个子组件内部 scoped,直接修改属性==
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
  > 直接对 tabbar 组件内部的 css 属性进行修改,.van-tabbar-item 是它的 class 名字
  > vue 使用第三方库都会用到这个方法

### Navbar 搭建

- 开始搭建 home 页面,搭建主页面的顶部 Navbar 组件
- 可以在 view/home 文件夹内再新建 cpns(components),创建 home-navbar.vue,负责显示顶部 Navbar
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
- 直接引入 home.vue,同时配置 home.vue 的 banner(非轮播图片,不单独封装组件了)

  ```html
  <!-- home.vue -->
  <template>
    <div class="home">
      <!-- 2种写法都行 -->
      <!-- <HomeNavbar/> -->
      <home-navbar />
      <div class="banner">
        <img src="/img/home/banner.webp" alt="" />
      </div>
    </div>
  </template>

  <script setup>
    // 引入HomeNavbar组件
    import HomeNavbar from "./cpns/home-navbar.vue";
  </script>
  ```

### 定位功能组件

- 定位组件,放入 home 的 cpns

  ```html
  <template>
    <div class="home-sea-box">
      <div class="location">
        <div class="city" @click="goCity">广州</div>
        <div class="position" @click="getLocation">
          <span class="text">我的位置</span>
          <img src="/img/home/icon_location.png" alt="" />
        </div>
      </div>
    </div>
  </template>

  <script setup>
    import { useRouter } from "vue-router";

    const router = useRouter();

    // 1.跳转到位置/城市页面
    const goCity = () => {
      router.push("/city");
    };

    // 2.获取地理位置
    const getLocation = () => {
      // 基础js的api
      navigator.geolocation.getCurrentPosition(
        (res) => {
          console.log("获取位置成功!");
          const crd = res.coords;
          // 经纬度,在公司会把经纬度发给服务器,计算后返回给前端城市信息,也可以用高德,腾讯地图的共用api
          console.log(`Latitude : ${crd.latitude}`);
          console.log(`Longitude: ${crd.longitude}`);
          console.log(`More or less ${crd.accuracy} meters.`);
        },
        (err) => {
          console.log("获取位置失败");
          console.warn(`ERROR(${err.code}): ${err.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    };
  </script>
  ```

  > 1.第一个事件,跳转 city 页面(自行创建页面并注册路由) 2.第二个事件,这个是 js 的 api,看着文档会用即可

### tabbar 组件的显示

- 比如,主页的 home 页面是显示 tabbar 组件的,但是跳转的 city 页面不显示,如何动态地显示与不显示它
- 方法 1: 路由注册+meta
  [![pEfgf4s.png](https://s21.ax1x.com/2025/04/16/pEfgf4s.png)](https://imgse.com/i/pEfgf4s)
- 方法 2: 全局 css
  [![pEfgWNj.png](https://s21.ax1x.com/2025/04/16/pEfgWNj.png)](https://imgse.com/i/pEfgWNj)

### city 页面

- ==简单地应用 vant 的组件==
- 搜索 search 和 Tab 标签页

  ```html
  <template>
    <!-- <div class="city top-page"> -->
    <div class="city">
      <van-search
        v-model="value"
        placeholder="城市/区域/位置"
        show-action
        @cancel="onCancel"
      />
      <!-- tabActive绑定点击索引(0开始) -->
      <van-tabs v-model:active="tabActive">
        <van-tab title="国内-港澳台">内容 1</van-tab>
        <van-tab title="海外">内容 2</van-tab>
      </van-tabs>
    </div>
  </template>

  <script setup>
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    const router = useRouter();

    const tabActive = ref();

    const onCancel = () => {
      router.back();
    };
  </script>
  ```

  > 全部是自定义的组件,添加了部分属性,自带的
  > common.js 中自定义了 Tab 组件底边颜色的样式,less 变量方法(略)

### 网络请求架构(\*)

- 下载:`npm i axios`
- axios 封装 /service/request/index.js (==代码略==)
- 配置基础常量 /service/request/config.js
  ```js
  // 任意一个即可
  const BASE_URL = "http://codercba.com:1888/api";
  // const BASE_URL = 'http://123.207.32.32:1888/api'
  const TIMEOUT = 10000;
  export { BASE_URL, TIMEOUT };
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
  > 统一维护 city 页面的网络请求,后期代码多了也好维护
  > 其他的页面网络请求同理
- 配置统一导出 /service/index.js
  ```js
  // 导出modules/city内部的所有函数
  export * from "./modules/city";
  ```
  > 主要方便 vue 页面导入这些网络请求,index.js 默认不写,导入直接`@/service`即可,如下
- city.vue
  ```js
  import { getCityAll } from "@/service";
  getCityAll().then((res) => console.log(res));
  ```
- 结构图
  [![pEh95Gj.png](https://s21.ax1x.com/2025/04/16/pEh95Gj.png)](https://imgse.com/i/pEh95Gj)
- ==2.新的封装,把 vue 中网络请求放入 store 中==
- vue 文件中直接网络请求的缺点
  - 1.代码冗余,有很多对网络请求的数据处理代码
  - 2.许多子组件需要网络请求的数据,但是只用一次,使用 props 有点麻烦
- store/modules/city.js,处理 city 页面的 store

  ```js
  import { getCityAll } from "@/service";
  import { defineStore } from "pinia";

  const usecityStore = defineStore("city", {
    state: () => ({
      allCities: {}, // 保存城市数据
    }),
    actions: {
      async fetchAllCitiesData() {
        const res = await getCityAll(); // 请求城市数据
        this.allCities = res.data;
      },
    },
  });

  export default usecityStore;
  ```

  > 此时 actions 内的函数不会自动运行,引入 store 时记得运行

- city.vue
  ```js
  import { useRouter } from "vue-router";
  // 使用store
  const cityStore = usecityStore();
  cityStore.fetchAllCitiesData(); // 调用里面的函数,获取城市数据
  const { allCities } = storeToRefs(cityStore); // 使得allCities具有响应式
  ```
  > ==注意获取响应式数据时不要只解构,会失去响应式,要 storeToRefs 处理 store==
- ==总结如下图==
  [![pEh9IRs.png](https://s21.ax1x.com/2025/04/16/pEh9IRs.png)](https://imgse.com/i/pEh9IRs)
- 3.数据处理,v-for 对象
  ```html
  <van-tabs v-model:active="tabActive">
    <template v-for="(value,key,index) in allCities" :key="key">
      <van-tab :title="value.title"></van-tab>
    </template>
  </van-tabs>
  ```
  > 这样数据如何改动,数量变多变少都不影响,比起直接 allCities.XXX.XXX 方便的多

### tab 与滚动条的布局(\*)

- 方案 1: tabbar 固定,content 超出后自动带滚动条,需要 margin-top 留出 tabbar 的位置
- ==缺点: 全页面滚动条==

  ```css
  .top {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
  }

  .content {
    /* tabbar 固定高度 98px*/
    margin-top: 98px;
  }
  ```

  [![pEhZTSS.png](https://s21.ax1x.com/2025/04/16/pEhZTSS.png)](https://imgse.com/i/pEhZTSS)

- ==(**选它**)方法 2: 局部滚动,但是需要 content 有自己的高度==
  ```css
  .content {
    /* tabbar 固定高度 98px*/
    height: calc(100vh - 98px);
    overflow-y: auto;
  }
  ```

### city 数据处理(\*)

- 学习数据处理的方法,获取城市数据如下 ==allCities==
  [![pEhZ7Qg.png](https://s21.ax1x.com/2025/04/16/pEhZ7Qg.png)](https://imgse.com/i/pEhZ7Qg)
  ```js
  // 遍历数据的方式
  allCities.cityGroup.title; // 太死板
  allCities["cityGroup"]; // 如果把内部的数据变为响应式,就很灵活
  ```
- vant 组件正好提供了这个 api
  ```html
  <!-- tabActive是索引值 -->
  <van-tabs v-model:active="tabActive">
    <template v-for="(value,key,index) in allCities" :key="key">
      <!-- 看文档,name属性可以固定tab标签的索引值 -->
      <van-tab :title="value.title" :name="key"></van-tab>
    </template>
  </van-tabs>
  ```
  > tabs 的 tabActive 是 tab 索引的值,而 tab 的 name 属性可以更改索引的值,所以在遍历 allCities 数据的时候把 key 值赋值给 name,这个 key 值就是遍历 allCities 对象的'cityGroup'和'cityGroupOverSea',所以 tabActive 动态获取到了它们的值
- ==响应式地获取对应栏的数据==
  ```js
  // 国内-港澳台和海外的整体数据
  // allCities经过storeToRefs转化已经为ref类型数据了,需要加value
  // 使用key值直接从allCities中获取的数据是没有响应式的,所以用计算属性,一旦计算属性内部依赖的值发生改变就会重新计算
  let currentGroup = computed(() => allCities.value[tabActive.value]);
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

### city 数据展示

- 先展示再封装,数据比较复杂,认真理理
  ```html
  <div class="content">
    <!-- 异步获取的数据,开始为undefined,用? -->
    <template
      v-for="(group,index) in allCities[tabActive]?.cities"
      :key="index"
    >
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
        default: {},
      },
    });
  </script>
  ```

- city.vue
  ```html
  <div class="content">
    <cityGroup :group-data="currentGroup"></cityGroup>
  </div>
  ```
  > 记得引入组件,currentGroup 是单个板块的数据,已经区分过了

### IndexBar 组件

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

### 优化 city 渲染(\*)

- 一次性渲染两个组件的数据,切换时只是显式对应的组件(v-show),这样速度更快,不用重新渲染
- 之前是替换 currentGroup 的数据,依据响应式重新渲染,数据多,比较慢
  ```html
  <div class="content">
    <template v-for="(value,key,index) in allCities" :key="index">
      <cityGroup v-show="tabActive === key" :group-data="value"></cityGroup>
    </template>
  </div>
  ```

### 阶段总结

- city 页面本身不难,组件节省了很多工夫,但是数据比较复杂,所以需要认真处理好数据的循环

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
        <div class="hotCitiesItem" @click="selectCity(item)">
          {{ item.cityName }}
        </div>
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
  > 在基础城市上面再做一个 for 循环,然后配置好样式
- ==2.右侧索引的处理==
- IndexBar 的索引是依据顺序自动配置的,依据文档,可以通过 van-index-bar 的 index-list 配置索引有谁,这里动态配置,给热门数据单独配置`*`,其余的由 cities.group 动态获取,减少一些不必要的首字母(例如,没有城市的拼音首字母开头是 V)
  ```js
  // 获取城市的分组信息
  const indexList = computed(() => {
    const list = props.groupData.cities.map((item) => item.group);
    // 额外给热门加一个索引*
    list.unshift("*");
    return list;
  });
  ```

### 主页热门城市回显(\*)

- 主页面需要城市数据的组件可能比较多,单纯传递数据比较麻烦,可以使用事件总线,统一发出,谁用谁监听,==不过最简单的,还是依据 citystore 统一处理数据==
- city.store
  ```js
    state: ()=>({
      allCities:{},
    + currentCity: {
        cityName: '北京'
      }
    })
  ```
- 在城市页面获取到城市数据,然后放入 citystore 中
- 上面 html 代码中,已经配置了 selectCity 事件监听
  ```js
  // 监听城市点击
  const selectCity = (city) => {
    // -> city store
    cityStore.currentCity = city;
    // 返回上一级
    router.back();
  };
  ```
  > 这里 selectCity 事件监听一个监听自己的 div,一个监听 vant 组件 van-cell,是否能监听组件取决于组件内部对于监听事件的设置,后面会讲
- home 页面回显城市名 home-search-box.vue
  ```js
  const cityStore = usecityStore();
  const { currentCity } = storeToRefs(cityStore); // 现在的城市
  ```
  > 把 currentCity 放到对应 html 位置

### 日期处理 dayjs(\*)

- ==有关日期的处理,推荐用 dayjs 库即可==
- 下载: `npm i dayjs`
- 写好酒店选日期的 html 和 css 样式,略(home-search-box.vue)
- 计算开始时间,结束时间,stay 时间
  ```js
  // 日期自动格式化
  const nowDate = new Date();
  // 新的天数这样加,不要直接new Date()+1,防止出现'7月32日'
  const newDate = new Date();
  newDate.setDate(nowDate.getDate() + 1); // 不返回新的值,直接改原对象
  // 开始日期,结束日期,停留日期
  const startDate = ref(formatMonthDay(new Date()));
  const endDate = ref(formatMonthDay(newDate));
  const stayCount = ref(1);
  stayCount.value = getDiffDays(nowDate, newDate); // 可有可无,默认就是1天
  ```
- ==dayjs 计算日期封装进 utils==
  ```js
  import dayjs from "dayjs";
  // 格式化月日
  export function formatMonthDay(date) {
    return dayjs(date).format("MM月DD日");
  }
  // 计算日期差值(天)
  export function getDiffDays(startDate, endDate) {
    return dayjs(endDate).diff(startDate, "day");
  }
  ```

### 日历组件

- 简单使用日历组件,简单修改 css 样式(less 变量)和样式配置,略
- 复用 dayjs 日期差值计算的函数
  ```html
  <!-- 日历 -->
  <van-calendar
    class="calendar"
    v-model:show="isCalendarShow"
    type="range"
    @confirm="onConfirm"
    color="#ff9527"
  />
  ```
  ```js
  // 日历
  const isCalendarShow = ref(false);
  // 组件自带,确定按钮事件处理函数
  const onConfirm = (value) => {
    // 日历区间默认参数value->数组[开始,结束]
    // 格式化入住,离开事件
    startDate.value = formatMonthDay(value[0]);
    endDate.value = formatMonthDay(value[1]);
    // 计算天数差值
    stayCount.value = getDiffDays(value[0], value[1]);
    // 关闭日历
    isCalendarShow.value = false;
  };
  ```

### 城市热门数据

- 城市热门数据也是 service 网络请求,store 保存数据,然后 vue 直接引入,前面网络架构学过了,完全一致
- 看文件目录即可,代码略

### 行高行距问题(\*)

- normalize.css 中把 html 的 line-height 设置为 1.15,在页面元素没有设置行高时,默认 font-size\*1.15 就是它的行高; 行高分配是,行高减去字体高度,然后在字体上下平分,实现纵向居中,浏览器不会显示带小数 px 间距,所以有时候,比如剩余 1.8px,可能上边 1px,下面 0.8px(小数省略了),最终只有上面 1px,下面 0px;
- 在页面放大缩小时,浏览器重新记录 px,有时候缩放后,剩余 px 可能正好整除,所以显示又正常了(居中)
- ==解决: 可以重置 reset.css,不建议设置为 1(紧紧包裹文字,不美观),可以设置为 1.2(浏览器通用)==

### 位置信息问题

- 可以使用腾讯和高德的 SDK,使用它们的服务器处理你的经纬度,返回对应的城市位置等

### 搜索跳转与 query 传参

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
      path: "/search",
      query: {
        // ref数据传值要.value
        startDate: startDate.value,
        endDate: endDate.value,
        currentCity: currentCity.value.cityName,
      },
    });
  };
  ```

### 分类管理搭建

- 分类组件的数据请求依据'网络请求架构'里的思路,存入 store
- 在新的 home 组件中,获取数据,简单配置样式即可

  ```js
  import useHomeStore from "@/store/modules/home";
  import { storeToRefs } from "pinia";

  // 获取数据
  const homestore = useHomeStore();
  homestore.fetchCategories();
  const { categories } = storeToRefs(homestore);
  ```

### 客房列表搭建

- 新组件: home-content
  [![pE4pydO.png](https://s21.ax1x.com/2025/04/18/pE4pydO.png)](https://imgse.com/i/pE4pydO)
- 依据 discoveryContentType 来确定客房的 html 和 css 布局,有 2 种样式,==,封装进公共组件/components/home==
  ```html
  <div class="home-content">
    <div class="title">热门精选</div>
    <!-- 客房列表,分两种类型 -->
    <div class="list">
      <template v-for="(item,index) in houseList" :key="item.data.houseId">
        <!-- 样式不同显示不同的组件 -->
        <HouseItemV9
          v-if="item.discoveryContentType === 9"
          :item-data="item.data"
        />
        <HouseItemV3
          v-if="item.discoveryContentType === 3"
          :item-data="item.data"
        />
      </template>
    </div>
  </div>
  ```
  > 具体两个组件就不展示了,获取到父传子的数据后,配置 html 和 css 即可
  > 部分数据需要`?.`,有的 item 数据中可能没有一些通用的属性
- params 传参,多页 page,==客房有多页数据,每次请求新的一页==
- ==注意,请求新的数据要追加,不要覆盖原数据==
- store 中负责请求数据,直接在里面操作即可
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
  export function getHouseList(currentPage) {
    return hyRequest.get({
      url: "/home/houselist",
      // 接受page参数
      params: {
        page: currentPage,
      },
    });
  }
  ```

### window 滚动与加载(*)

- 复习 css 的三个变量的关系,如下
- ==蓝色是整体页面,橙色是浏览器的可视化窗口==
  [![pE4pseK.png](https://s21.ax1x.com/2025/04/18/pE4pseK.png)](https://imgse.com/i/pE4pseK)
- ==把滚动封装进 hooks 中,/hooks/useScroll.js==
- ==在 hooks 中,当滚动到底部时,需要网络请求新数据,有 2 个方法解决==
  >
- ==方法 1:传递函数==
- 毕竟请求网络数据的函数不能写死

  ```js
  import { onMounted, onUnmounted, ref } from "vue";

  // 方法1: 通过回调函数
  export default function useScroll(cb) {
    const scrollListenerHandler = () => {
      const clientHeight = document.documentElement.clientHeight;
      const scrollTop = document.documentElement.scrollTop;
      const scrollHight = document.documentElement.scrollHeight;

      // 防止小数点精确问题(1~2px即可)
      if (scrollTop + clientHeight + 2 >= scrollHight) {
        // 执行外边传进来的函数,比如请求houseList的函数
        if (cb) cb();
      }
    };

    onMounted(() => {
      window.addEventListener("scroll", scrollListenerHandler);
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", scrollListenerHandler);
    });
  }
  ```

- home.vue
  ```js
  import useScroll from "@/hooks/useScroll";
  // 方法1: 回调函数不易控制
  useScroll(homestore.fetchHouseList);
  ```
  > 传递回调函数不好管理,而且操作起来不一定只需要一个回调函数,所以推荐方法 2,变量方法,变量更好操作
- ==方法 2: 变量方法==

  ```js
  // 2.方法2: 变量返回
  export default function useScroll() {
    const isReachBottom = ref(false); // 是否到达底部
    const scrollListenerHandler = () => {
      const clientHeight = document.documentElement.clientHeight;
      const scrollTop = document.documentElement.scrollTop;
      const scrollHight = document.documentElement.scrollHeight;

      // 防止小数点精确问题(1~2px即可)
      if (scrollTop + clientHeight + 2 >= scrollHight) {
        isReachBottom.value = true;
      }
    };

    // 在页面创建与销毁时,创建和销毁对应的监听事件,window监听事件不销毁,是会一直保留的!
    onMounted(() => {
      window.addEventListener("scroll", scrollListenerHandler);
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", scrollListenerHandler);
    });

    return { isReachBottom };
  }
  ```

- home.vue

  ```js
  // hooks
  import useScroll from "@/hooks/useScroll";
  // store
  import useHomeStore from "@/store/modules/home";
  const homestore = useHomeStore();

  // 方法2: 推荐变量方法
  const { isReachBottom } = useScroll();
  // 监听isReachBottom的变化,在没有immediate属性下,默认第一次不执行,之后只要变量变化,就执行回调
  // 新变量值作为参数传递给回调函数,当到达底部时,newValue=true,请求新的数据
  watch(isReachBottom, (newValue) => {
    if (newValue) {
      // 更严谨,在确定请求数据成功后在设置'未到达底部'
      homestore.fetchHouseList().then(() => {
        // 获取的isReachBottom是ref类型
        isReachBottom.value = false;
      });
    }
  });
  ```

  > 后续优化,比如节流函数,控制监听频率,针对 keep-alive 的情况,需要新的 window 监听

### 优化滚动 hooks(\*)

- 更多的响应式返回(ref),新增 search-bar 组件
- 组件的的内部代码略,显示样式如下,封装进组件 components/search-bar
  [![pE47kmd.png](https://s21.ax1x.com/2025/04/20/pE47kmd.png)](https://imgse.com/i/pE47kmd)
- ==1.之前的滚动 hooks 只返回是否到达底部,而 scrollTop 等 3 个参数最好也返回出去,用不用看用户,这样更加灵活的==
- ==2.节流函数,降低触发滚动监听的频率==
- ==业务中不用手写,用第三方库 underscore,`npm i underscore`==

  ```js
  import { onMounted, onUnmounted, ref } from "vue";
  // 1.全部引入,使用对应的方法 _.XXX
  // import _ from 'underscore'
  // 2.单独对方法引入
  import { throttle } from "underscore";
  // 最终改进
  export default function useScroll() {
    const isReachBottom = ref(false); // 是否到达底部
    // 更好的响应式,外界可以自由获取更多数据
    const clientHeight = ref(0);
    const scrollTop = ref(0);
    const scrollHight = ref(0);
    // 节流函数throttle
    const scrollListenerHandler = throttle(() => {
      clientHeight.value = document.documentElement.clientHeight;
      scrollTop.value = document.documentElement.scrollTop;
      scrollHight.value = document.documentElement.scrollHeight;
      // 防止小数点精确问题(1~2px即可)
      if (scrollTop.value + clientHeight.value + 2 >= scrollHight.value) {
        isReachBottom.value = true;
      }
    }, 100); // 100ms

    // 在页面创建与销毁时,创建和销毁对应的监听事件,window监听事件不销毁,是会一直保留的!
    onMounted(() => {
      window.addEventListener("scroll", scrollListenerHandler);
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", scrollListenerHandler);
    });

    return { isReachBottom, clientHeight, scrollHight, scrollTop };
  }
  ```

  > 1.把 clientHeight,scrollTop,scrollHight 返回出去,使用定义为 ref,具有响应式 2.节流函数使用第三方库

- 主页 home.vue 动态显示搜索栏
  ```html
  <!-- 搜索栏 -->
  <div class="search-bar" v-if="isSearchShow">
    <searchBar />
  </div>
  ```
  ```js
  // 新增返回scrollTop
  const { isReachBottom, scrollTop } = useScroll();
  // 是否显示搜索栏
  const isSearchShow = computed(() => scrollTop.value >= 350);
  ```

### watch 与 computed(\*)

- 同样 useScroll 获取的值,监听响应式使用 watch 和 computed 两种方法处理

  ```js
  watch(isReachBottom, (newValue) => {
    if (newValue) {
      // 更严谨,在确定请求数据成功后在设置'未到达底部'
      homestore.fetchHouseList().then(() => {
        // 获取的isReachBottom是ref类型
        isReachBottom.value = false;
      });
    }
  });

  // 是否显示搜索栏
  const isSearchShow = computed(() => scrollTop.value >= 350);
  ```

  > watch 可以更好的处理 js 逻辑,而 computed 只有一行代码;如果要求最终只返回一个简单的值,可以用计算属性,如果中间要求有一些 js 逻辑(比如给 XX 赋值等),就用 watch,计算属性只处理简单的运算,返回简单的值;watch 可以处理复杂的 js 逻辑

### MainStore(\*)

- ==存储公用且常用的数据,比如 token,isLoading 以及住酒店的开始结束日期(startDate,endDate)==
- ==任务==:
  - 处理 home-search-box.vue 中 startDate/endDate 以及部分代码重构
  - 搜索组件 search-bar 同时获取到日期
- main.js(/store/modules)

  ```js
  import { defineStore } from "pinia";

  // 日期自动格式化
  const startDate = new Date();
  // 新的天数这样加,不要直接new Date()+1,防止出现'7月32日'
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 1); // 不返回新的值,直接改原对象

  const useMainStore = defineStore("main", {
    // mainstore存放公用且常用的值
    state: () => ({
      startDate: startDate,
      endDate: endDate,
    }),
  });

  export default useMainStore;
  ```

- 重构代码

  ```js
  import useMainStore from "@/store/modules/main";

  // 获取store中的开始日期,结束日期
  const mainstore = useMainStore();
  const { startDate, endDate } = storeToRefs(mainstore);
  // 计算属性,响应式依赖内部startDate和endDate值的变化 (ref数据记得.value和修改html中变量)
  const startDateStr = computed(() => formatMonthDay(startDate.value));
  const endDateStr = computed(() => formatMonthDay(endDate.value));
  const stayCount = ref(1); // 停留时间
  stayCount.value = getDiffDays(startDate.value, endDate.value); // 可有可无,默认就是1天
  ```

- 搜索组件使用日期 startDate,endDate

  ```js
  import useMainStore from "@/store/modules/main";
  import { formatMonthDay } from "@/utils/format.date";

  // 获取mainstore中的开始日期,结束日期
  const mainstore = useMainStore();
  const { startDate, endDate } = storeToRefs(mainstore);
  const startDateStr = computed(() => formatMonthDay(startDate.value, "MM.DD"));
  const endDateStr = computed(() => formatMonthDay(endDate.value, "MM.DD"));
  ```

- ==最后,修改下工具函数 formatMonthDay==
  ```js
  // 格式化月日
  export function formatMonthDay(date, formatStr = "MM月DD日") {
    return dayjs(date).format(formatStr);
  }
  ```
  > 用户可以自己传入想要的日期格式

### isLoading 动画(\*)

- **给 axios 请求数据等待时添加过场动画**
- 内容: isLoading 大致的页面配置和 mainstore 中参数配置
- ==isLoading 页面是加载动画蒙版,有灰色背景和居中的加载动画 gif==
  ```html
  <!-- 这样写也有响应式,使用的少的变量这样写更省事 -->
  <div class="loading" v-if="mainstore.isLoading" @click="loadingClick">
    <div class="bg">
      <img src="/img/home/full-screen-loading.gif" alt="" />
    </div>
  </div>
  ```
- ==css 公式(部分),有空可以看看 codewhy 的 css 课==
  ```css
  .loading {
    /* 占满全屏 */
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 999;
    /* 内容居中的flex */
    display: flex;
    justify-content: center;
    align-items: center;
    /* 灰色蒙版 */
    background-color: rgba(0, 0, 0, 0.3);
  }
  ```
- 是否显示加载动画由 isLoading 变量负责,之前讲过,这种公用且常用的变量放入 mainstore,具体代码略,默认值 false(不显示)

  ```js
  import useMainStore from "@/store/modules/main";

  const mainstore = useMainStore();
  const loadingClick = () => {
    mainstore.isLoading = false;
  };
  ```

  > 引入 mainstore 中的 isLoading 变量,结合 v-if 决定是否显示加载动画
  > 事件 loadingClick,只要点击加载动画的背景(蒙版),即隐藏加载动画

- ==加载动画的组件最终部署到 App.vue 中,保证每个页面都有==
  ```html
  <template>
    <div>
      <div class="page-content">
        <RouterView></RouterView>
      </div>
      <TabBar v-if="!route.meta.hideTabbar"></TabBar>
      <!-- 加载动画组件 -->
      <Loading />
    </div>
  </template>
  ```
- axios 拦截器,在 service/request/index.js 中

  ```js
  class HYRequest {
    constructor(baseURL, timeout = 10000) {
      this.instance = axios.create({
        baseURL,
        timeout,
      });

      // 拦截器是针对axios实例写的,axios.interceptors.XXX.use()
      // 1.发送前,拦截器都是两个回调,成功的和失败的回调函数
      this.instance.interceptors.request.use(
        (config) => {
          mainstore.isLoading = true; // 发送成功
          return config;
        },
        (err) => {
          return err;
        }
      );
      // 2.响应后(无论请求成功或失败,都需要隐藏掉isLoading)
      this.instance.interceptors.response.use(
        (res) => {
          mainstore.isLoading = false; // 接受成功
          return res;
        },
        (err) => {
          mainstore.isLoading = false; // 接受失败
          return err;
        }
      );
    }

    // .....
  }
  ```

  > 每次使用 HYRequest 类,都是 new HYRequest(),根据代码,每次都创建一个新的 axios 实例,而 axios 拦截器 interceptors 是挂载到 axios 实例上面的,所以挂载到当前创建的 axios 实例即`this.instance.interceptors.use()`

### 属性透传(\*)

- 之前 vant 组件直接绑定事件提到过,这里根据自己写的 house-item-v3/9 详细说明,组件绑定的事件或 className 到底绑定到哪里,如下图
  [![pE47iOH.png](https://s21.ax1x.com/2025/04/20/pE47iOH.png)](https://imgse.com/i/pE47iOH)
  > ==详细笔记可见 vue 进阶的属性透传,默认根标签,可以通过$attr 指定新的透传标签,同时可以设置属性禁止默认地向根标签透传行为==
- 绑定好事件后,传递 houseId(detail.vue 的 params 传参)
  ```html
  <!-- home/cpns/home-content.vue -->
  <div class="list">
    <template v-for="(item, index) in houseList" :key="item.data.houseId">
      <HouseItemV9
        v-if="item.discoveryContentType === 9"
        :item-data="item.data"
        @click="itemClick(item.data)"
      />
      <HouseItemV3
        v-if="item.discoveryContentType === 3"
        :item-data="item.data"
        @click="itemClick(item.data)"
      />
    </template>
  </div>
  ```
  ```js
  const router = useRouter();
  const itemClick = (item) => {
    router.push("/detail/" + item.houseId);
  };
  ```

### detail 详情页搭建

- 简单搭建+传递 params 参数
  ```js
    // router/index.js
   {
      path: '/detail/:id', // 动态路由获取houseId
      component: ()=>import('@/views/detail/detail.vue'),
      meta:{
        hideTabbar:true
      }
    }
  ```
- detail.vue

  ```html
  <template>
    <div>detail: {{ $route.params.id }}</div>
  </template>

  <script setup>
    import { useRoute } from "vue-router";

    const route = useRoute();
    const houseId = route.params.id;
  </script>
  ```

  > ==html 和 js 中获取 params 参数的 2 种方式==

### 详情页开发(页内管理)(\*)

- 数据复杂的一个页面,数据很多很杂,分模块一点点做,同时把数据分割
- ==**之前一直用的 store 管理,detail 页面我们用页内管理,两种思路都学习下**==
- service/modules 配置好请求房间详情信息的网络请求函数

  ```js
  import hyRequest from "../request";

  export function getDetailInfos(houseId) {
    return hyRequest.get({
      url: "/detail/infos",
      params: {
        houseId,
      },
    });
  }
  ```

- 在 detail.vue 页面中请求数据并保存

  ```js
  // 从params中获取房屋的id
  const route = useRoute();
  const houseId = route.params.id;

  // 房屋详情的网络请求
  const detailInfos = ref({});
  const mainPart = computed(() => detailInfos.value.mainPart); // 复杂数据拆解
  getDetailInfos(houseId).then((res) => (detailInfos.value = res.data));
  ```

### 轮播组件(父传子)(\*)

- 使用 vant 组件的轮播图,封装进组件 components
- ==**没有 store,组件获取信息就需要父传子了**==
- ==网络请求有延时,通过 v-if 解决==
  ```html
  <!-- 轮播,mainPart初始为undefined,网络请求是异步 -->
  <div v-if="mainPart">
    <detailSwipe :swipe-data="mainPart.topModule.housePicture.housePics" />
  </div>
  ```
  > 单独的`?.`太繁琐了,内部的数据都用 mainPart,所以外层包裹一个 div,使用 v-if 处理它即可
  ```js
  // 房屋详情的网络请求
  const detailInfos = ref({});
  // 复杂数据拆解
  const mainPart = computed(() => detailInfos.value.mainPart);
  getDetailInfos(houseId).then((res) => (detailInfos.value = res.data));
  ```
- ==子组件接受父组件的值==
  ```js
  // cpns/detail-swipe.vue
  defineProps({
    swipeData: {
      type: Array,
      default: () => [],
    },
  });
  ```

### 轮播+插槽(\*)

- 基础的轮播图搭建 + 自定义轮播样式
- ==自定义轮播的内容,插槽内部自定义自己想要的内容==
- ==作用域插槽,理解插槽的含义==
  ```html
  <div class="swipe">
    <van-swipe
      class="swipe-list"
      :autoplay="3000"
      indicator-color="white"
      lazy-render
    >
      <!-- 基础的轮播图item -->
      <template v-for="(item, index) in swipeData" :key="index">
        <van-swipe-item class="item">
          <img :src="item.url" alt="" />
        </van-swipe-item>
      </template>
      <!-- 自定义指示器,作用域插槽 + 具名插槽(indicator) -->
      <!-- 内部数据: active(当前item索引) total(总数) -->
      <template #indicator="{ active, total }">
        <div class="indicator">{{ active + 1 }}/{{ total }}</div>
      </template>
    </van-swipe>
  </div>
  ```
  > css 略,绝对定位到轮播区域右下角了

### 轮播数据处理(*)

- 轮播图太多,需要对数据进行分类
- ==**学习数据分类的思路,是一种算法思维,是一种处理数据的数据结构**==
  [![pE4OWmF.png](https://s21.ax1x.com/2025/04/20/pE4OWmF.png)](https://imgse.com/i/pE4OWmF)
  ```js
    展示数据 title: index+1/value.length
      显示  卧室: 2 / 6
    // 分类后放入对象,以key:value形式展示,分类过程中,相同的key会自动合并
    {
      // 以enumPictureCategory分类,相同的合并
      // 之后轮播图直接遍历其数组即可
      "2": [item1,item2,...,itemX]
      "4": [itema,itemb,...,itemY]
      ...
    }
  ```
- ==分类方法有 2 个==
- ==1.容易理解==
  ```js
  // 处理数据---分类
  const swipeGroup = {};
  // 思路1: 2次循环,第一次确定有哪些类(例如: "2": []),第二次,往对应类的数组里面存放item
  for (const item of props.swipeData) {
    swipeGroup[item.enumPictureCategory] = []; // 相同的key会合并
  }
  for (const item of props.swipeData) {
    const valueArray = swipeGroup[item.enumPictureCategory];
    valueArray.push(item);
  }
  ```
- ==2.优化的==
  ```js
  const swipeGroup = {};
  for (const item of props.swipeData) {
    // 因为swipeGroup是空对象,第一次获取为undefined
    let valueArray = swipeGroup[item.enumPictureCategory];
    if (!valueArray) {
      valueArray = [];
      swipeGroup[item.enumPictureCategory] = valueArray; // 把数组赋值回去
    }
    valueArray.push(item);
  }
  ```
- 分类后的数据展示
  [![pE4Ofw4.png](https://s21.ax1x.com/2025/04/20/pE4Ofw4.png)](https://imgse.com/i/pE4Ofw4)
  > 总结果 swipeGroup 是对象,分类以 key:value 形式划分,key 为类,value 为数据,数组形式方便后面遍历轮播图使用
- ==要求展示下面的轮播格式==
  - 删除不必要的字符
  - 轮播对应类的图片时,右下角有特殊样式
  - 轮播类中有数字提示
    [![pE4OhTJ.png](https://s21.ax1x.com/2025/04/20/pE4OhTJ.png)](https://imgse.com/i/pE4OhTJ)
- ==1.删除字符,2 个方法==
- 1.1 简单的
  ```js
  const getName = (name) => {
    // 方法1: 替换
    return name.replace("【", "").replace("】", "").replace("：", "");
  };
  ```
- 1.2 复杂的
  ```js
  const nameReg = /【(.*?)】/i;
  const getName = (name) => {
    // 方法2: 正则表达式
    const result = nameReg.exec(name);
    return result[1];
  };
  ```
- ==2.特殊样式展示(css 略),item==
  ```html
  <template #indicator="{ active, total }">
    <div class="indicator">
      <!-- 循环对象swipeGroup -->
      <template v-for="(value,key,index) in swipeGroup" :key="key">
        <!-- 被选中的轮播图类可以获取active的css样式,key是字符串,数据是Num -->
        item->
        <span
          class="item"
          :class="{active: swipeData[active]?.enumPictureCategory == key}"
        >
          <span class="text">{{ getName(value[0].title) }}</span>
          <!-- 被选中的类才会显示数量 -->
          count->
          <span
            class="count"
            v-if="swipeData[active]?.enumPictureCategory == key"
          >
            <!-- 获取当前组里的索引,而不是所有数据的索引 -->
            {{ getCategoryIndex(swipeData[active]) }} / {{ value.length }}
          </span>
        </span>
      </template>
    </div>
  </template>
  ```

  > 在轮播 html 中,使用动态 class 绑定 active,当它后面的表达式为 true 时,则添加新的 className(active)
  > 代码解析: `swipeData[active]?.enumPictureCategory == key`
  > ==swipeData 是总体数据 housePics(对象),active 是单项 item 索引,通过获取到单项数据 item 的 enumPictureCategory 与分类数组的 key 值作比较,当相等时则证明当前图片属于这个类,添加样式==
  > [![pE4OWmF.png](https://s21.ax1x.com/2025/04/20/pE4OWmF.png)](https://imgse.com/i/pE4OWmF)

- ==3.展示数量 count==
- 同理只有被选中的类才可以展示数量,所以使用 v-if 隐藏掉未选中的类的数字显示
- count 的索引的难点是当前图片在所在类的索引,而不是相对于全部数据的索引 active
- ==参数是当前图片的 item 数据==
  ```js
  // 获取数据在当前组的索引,参数是这个数据单项
  const getCategoryIndex = (item) => {
    // 找到所在类的数组
    const valueArray = swipeGroup[item.enumPictureCategory];
    // 在对应类中,找到和这个类相同的数据单项,返回它的索引 记得+1
    return valueArray.findIndex((data) => data === item) + 1;
  };
  ```

### 详情页组件与插槽(*)

- 搭建详情页,划分组件,处理数据和调整样式等
- ==配置组件,设置插槽(自定义内容)==,接下来很多模块常用,所以放在/components/detail-section 中
  ```html
    <template>
      <div class="section">
        <div class="header">
          <div class="title">{{title}}</div>
        </div>
        <div class="content">
          <!-- 只有一个插槽,默认插槽 -->
          <slot>
            <h3>我是默认内容</h3>
          </slot>
        </div>
        <!-- 当不传递moreText时,就不显示footer -->
        <div class="footer" v-if="moreText.length">
          <span class="more">{{moreText}}</span>
          <van-icon name="arrow" />
        </div>
      </div>
    </template>

    <script setup>
    defineProps({
      title: {
        type: String,
        default: '默认标题'
      },
      moreText: {
        type: String,
        default: ''
      }
    })
    </script>
  ```
- 房屋信息示意图
  [![pE5E5A1.png](https://s21.ax1x.com/2025/04/21/pE5E5A1.png)](https://imgse.com/i/pE5E5A1)
  > 插槽的内容html和css略

### 详情页其余板块
- ==1.房东介绍板块==
- 封装组件和复用部分组件,使用 slot 插槽提供自定义内容
  [![pE5Eh7R.png](https://s21.ax1x.com/2025/04/21/pE5Eh7R.png)](https://imgse.com/i/pE5Eh7R)
- 模板组件封装进 components/detail-section

- 根据不同的需求使用组件,插槽内自定义自己的内容 ==例如:detail/cpns/detail_03-facility.vue==
- common.css 统一设置图标
- ==2.用户评论板块==
- 复用组件 components/detail-section , 简单数据处理和搭建组件的样式等
  [![pE5EItx.png](https://s21.ax1x.com/2025/04/21/pE5EItx.png)](https://imgse.com/i/pE5EItx)

- ==3.用户须知板块 detail/cpns/06XX,没有 footer 板块,稍微调整 detail-seciton 的代码==
  [![pE5EfB9.png](https://s21.ax1x.com/2025/04/21/pE5EfB9.png)](https://imgse.com/i/pE5EfB9)
  > ==关于footer上面代码有==
### 百度地图(略)
- 简单学习使用百度地图和一些api,还是用上面的组件,slot内部是百度地图
- 之前跟着黑马用过腾讯的地图服务,==都差不多,百度地图需要先认证==

### TabControl导航栏(*)
- 给房屋详情detail.vue加一个TabControl信息栏
- 使用的顶部导航栏TabControl是之前课程封装过的,直接拿过来用了,并没有听是如何封装的 
- 在detail.vue(酒店详情页面),滚动到一定位置后,顶部显示一个tabbar导航栏; ==点击对应的导航栏,页面滚动到指定位置,之前hooks只监听页面滚动,不可以监听元素内的滚动,所以稍微修改下监听滚动的hooks==
  ```js
  + export default function useScroll(elRef){
    + let el = window // 默认监听window
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
    +     // 获取元素的数据
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
   +    if(elRef){ // 如果有传入元素,就监听这个元素
          el = elRef.value 
        }
        el.addEventListener('scroll',scrollListenerHandler)
      })

      onUnmounted(()=>{
    +   el.removeEventListener('scroll',scrollListenerHandler)
      })

      return {isReachBottom,clientHeight,scrollHight,scrollTop}
    }
  ```
- ==1.获取的元素通过ref获取,然后传入hooks的函数==
  ```js
    // TabControl 
    // 滚动监听,监听windows,不监听元素内的滚动,所以要修改hooks函数
    const detailRef = ref() // 获取detail(div)元素,不可以js(document.querySelect),因为这时候dom树没挂载(看看vue的生命周期)
    const {scrollTop} = useScroll(detailRef) // 传入要监听滚动的元素
    const showTabControl = computed(() => {
      return scrollTop.value > 100
    })
  ```
  > 当滚动大于100px时,显示TabControl组件
- ==2.点击对应的导航栏,页面滚动到指定位置,难点在于确定滚动的距离==
- 2.1初始的方法示例
  ```html
     <DetailLandlord ref="landlordRef" :landlord="mainPart.dynamicModule.landlordModule" />
  ```
  ```js
    // 获取各个组件,示例
    const landlordRef = ref()
    
    // 监听点击Tab的行为
    const tabClick = (index)=>{ // 返回点击栏目的索引
      detailRef.value.scrollTo({
        // 滚动到XX位置(top),offsetTop是当前元素到页面顶部的距离,减去TabControl的高度(防遮挡)
        // 通过ref获取元素后,记得.value,然后获取的是组件,通过.$el获取组件内的根元素
        // top: landlordRef.value.$el.offsetTop - 44, 
        top: sectionEls[index].offsetTop - 44,
        behavior: 'smooth' // 平滑滚动
      })
    }
  ```
  > ==通过scrollTo去位移页面,offsetTop是元素距离顶部的距离==
- ==2.2单一的ref获取过于麻烦,可以函数获取==
  ```html
    <DetailLandlord :ref="getSectionRef" :landlord="mainPart.dynamicModule.landlordModule" />
  ```
  ```js
    // 单独获取ref太麻烦,函数统一获取
    const sectionEls = []
    const getSectionRef = (value) => {
      // console.log('---------')
      // console.log(value) // 参数value就是组件的ref.value
      // console.log(value.$el) // 同理$el获取到组件根元素
      sectionEls.push(value.$el)
    }
  ```
  > ==通过动态绑定ref,获取默认参数value,是ref类型,需要`.value`,获取得值是组件,然后通过`.$el`获取组件内部根元素==
- vue的小bug,这个函数会执行多次,因为外层的某些元素变化,所以设置` v-memo="[mainPart]"`
  ```html
    <!-- v-memo解决vue的小bug,不要重复地执行:ref绑定getSectionRef函数 -->
    <div v-if="mainPart" v-memo="[mainPart]">
      <DetailSwipe :swipe-data="mainPart.topModule.housePicture.housePics" />
      <DetailInfos :ref="getSectionRef" :top-infos="mainPart.topModule" />
      <!-- .... -->
    </div>
  ```
  > v-memo 指令接收一个数组作为参数，数组中的元素是用来判断是否需要重新渲染的依赖项。当这些依赖项的值没有发生变化时，Vue 会复用之前渲染的结果，而不会重新渲染使用了 v-memo 的元素或组件。
  > ==所以只要依赖项mainPart不变,就不会重新渲染里面的组件,就不会重复执行getSectionRef函数==
- 设置Tab-control的标题栏参数,通过titles传入
  ```html
    <TabControl 
      class="tabs" 
      v-if="showTabControl" 
      :titles="['描述','房东','设施','评论','须知']"
      @tabItemClick="tabClick"
    />
  ```
  > titles是写死的,可以再加改进
- ==3.整理更加优秀的数据,再次改进==
  ```
    改进的数据结构 -> {'设施': value.$el , '房东': value.$el , ... }
  ```
  ```html
    <TabControl 
      class="tabs" 
      v-if="showTabControl" 
      :titles="names"
      @tabItemClick="tabClick"
    />
  ```
  ```js
    // 改进的数据结构 -> {'设施': value.$el , '房东': value.$el , ... }
    const sectionEls = ref({})
    // Tab-control栏的动态显示
    const names = computed(() => {
      // ['描述','房东','设施','评论','须知']
      return Object.keys(sectionEls.value)
    })

    const getSectionRef = (value) => {
      // getAttribute获取根元素的name属性的值(组件透传,组件的根元素也有name属性)
      const name = value.$el.getAttribute('name')
      // 分类操作
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
  ```
### detail页面返回修复
- 修复:ref的函数
  ```js
    const getSectionRef = (value) => {
      // 当离开页面卸载组件时,会再次执行这个函数,此时value为null,需要特殊处理
      if(!value) return 
      const name = value.$el.getAttribute('name')
      sectionEls.value[name] = value.$el 
    }`
  ```
  > 遇到null undefined的错误,定位好位置和发生时机,加一个小的逻辑判断即可解决
### 页面滚动匹配TabControl索引(*)
- ==一种算法思维,应用比如有'歌词匹配'==
- ==页面滚动到一定位置时显示正确的TabControl索引==
  - 1.监听滚动的位置scrollTop
  - 2.利用scrollTop匹配正确位置,例如,下面区域的开始区域,描述300px,设施500px,房东800px,评论1200px,须知1400px,当滚动到600px时,属于设施区域
- 算法伪代码
  ```js
    // scrollTop: 600
    // 默认最后一个(索引),1700
    let index = values.length - 1 
    const values = [400,500,800,1200,1700]
    for(let i=0; i<values.length; i++){
      const value = values[i]
      // 找到第一个大于value的数值
      if(value > scrollTop){
        index = i - 1 // 当前索引对应值是第一个大于value的值scrollTop(800),所以索引-1取500
        break; // 跳出循环
      }
    }
  ```
  > 当匹配到结尾时,假如此时为1900,是匹配不到的,所以默认最后一个default:1700
  > 刚开始什么区域都没匹配到时,index为-1
- ==歌词匹配思路如下==
  ```
    00:24 hhhhhhhhhhh
    00:35 呵呵呵呵呵呵呵
    00:42 嘻嘻嘻嘻嘻嘻嘻
  ```
  当前时间为00:37,匹配到00:42,再往前一个(index-1),显示00:35的歌词
- ==把思路带进项目开始实现功能==
  ```js
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
  ```
  > values就是所有区域的开头位置,newValue监听的当前滚动位置scrollTop
### 切换页面keep-alive(*)
- 优化页面加载,保持页面存活,当页面切换时,会把前面的页面销毁,当切换回来时,又会重新搭建一次页面,里面的代码和网络请求都会重新请求
- ==我们希望首页保留下来 keep-alive==
- 因为组件都是setup语法糖,所以不好返回name值,如果要返回需要再写script标签并返回{name : 'home'},vue3不建议这么写
- App.vue ==vue3希望我们这么写==
  ```html
    <!-- vue3建议keep-alive这样使用 -->  
    <!-- 作用域插槽RouterView,默认值props,内有属性Component和route
        Component: 它代表当前路由匹配到的组件。这一属性一般用来动态渲染路由组件。
        route: path,query,params等,即useRoute中可获取的值 
    -->
    <RouterView v-slot="props">
      <!-- home组件可以keep-alive -->
      <!-- 动态组件,组件就是当前匹配的路由组件(注释不要写进keep-alive里面,会报错) -->
      <keep-alive includes="home">
        <component :is="props.Component"></component>
      </keep-alive>
    </RouterView>
  ```
### 修复页面切换网络请求(*)
- 多页面滚动最好不要设置window,会混淆,比如主页home,监听滚动到底部进行网络请求,当切换页面时,window还在监听,如果新的页面本身高度有限,默认就会触发到达底部的监听,会在进行一次网络请求; 而且如果新页面也有滚动事件,两个页面会混淆
- ==之前优化过hooks,可以传入指定元素,所以把home.vue的根元素作为指定元素传入,防止了页面间的互相混淆==
  ```html
    <div class="home" ref="homeRef">
      <!-- ... -->
    </div>
  ```
  ```js
    const homeRef = ref()
    const { isReachBottom,scrollTop } = useScroll(homeRef)
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
  > div-home的css配置为 height: 100vh;和over-flow: auto;
### 返回位置记录(*)
- 切换页面时,返回时保留页面位置,==这种保留位置的记忆操作只会在keep-alive页面中取做==
  ```js
    // onActivated生命周期钩子,在keep-alive组件被激活时执行
    onActivated(() => {
      homeRef.value?.scrollTo({
        top: scrollTop.value // 上一次离开时的滚动位置scrollTop
      })
    })
  ```
  > scrollTop一直有在监听
### 视口设置和pxtovw单位(*)
- 禁止用户随意缩放移动端界面
- index.html
  ```html
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,minimum-scale=1.0, user-scalable=no" />
  ```
- 所有的单位px->vw,大小屏幕的适配方案
- vs插件可以一个个转化,不过比较麻烦,有个方法可以一次性修改
- 使用打包工具时,比如vite/webpack时->postcss->plugins->postcss-px-to-viewport(vw)
  ==下载:== `npm i postcss-px-to-viewport -D`
- 在vite中配置(==检视元素发现单位为vw,默认设计稿375==)
- vite.config.js ==设置完后重启vite==
  ```js
    import { defineConfig } from "vite";
    import vue from "@vitejs/plugin-vue";
    import path from "path";
    import Components from "unplugin-vue-components/vite";
    import { VantResolver } from "unplugin-vue-components/resolvers";
    import postcssPxToViewport from 'postcss-px-to-viewport-8-plugin';

    // https://vite.dev/config/
    export default defineConfig({
      plugins: [
        vue(),
        Components({
          resolvers: [VantResolver()],
        }),
      ],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "src"),
        },
      },
      css: {
        postcss: {
          plugins: [
            postcssPxToViewport({
              unitToConvert: "px", // 要转换的单位，默认为 'px'
              viewportWidth: 375, // 视口宽度，一般是设计稿的宽度
              unitPrecision: 5, // 转换后的精度，即小数点后的位数
              propList: ["*"], // 可以从 px 转换为视口单位的属性列表，'*' 表示匹配所有属性
              viewportUnit: "vw", // 转换后的视口单位
              fontViewportUnit: "vw", // 字体使用的视口单位
              selectorBlackList: [], // 需要忽略的选择器，不会进行转换
              minPixelValue: 1, // 最小的转换数值，如果小于这个值则不进行转换
              mediaQuery: false, // 是否允许在媒体查询中转换 px
              replace: true, // 是否直接替换属性值，而不添加备用属性
              exclude: undefined, // 忽略某些文件夹下的文件或特定文件
              include: undefined, // 如果设置了 include，只有匹配到的文件才会被转换
              landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件
              landscapeUnit: "vw", // 横屏时使用的单位
              landscapeWidth: 1134, // 横屏时使用的视口宽度
            }),
          ],
        },
      },
    });
  ```
  > vant4/进阶用法中,还有webpack方面的配置