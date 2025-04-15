# vue-demo练习
## 项目准备工作
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
### 补充less知识点
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
### 组件库自定义样式
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
  