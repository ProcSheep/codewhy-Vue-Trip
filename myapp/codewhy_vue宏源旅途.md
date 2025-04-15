# vue-demo练习
## 工程化文件
- 1.创建vite文件目录: 
  - pubilc: ==静态资源 图片优选==
  - src内部:
    - assets: 静态css,data数据
    - components: 抽取组件 tabbar sidebar
    - ==hooks==: 封装通用方法
    - ==mock==: 测试数据
    - router: 路由
    - ==service==: 网络请求
    - store: pinia状态管理,/modules为不同的store
    - utils: 工具方法(函数) format等
    - views: 页面组件vue
  - ==jsconfig.json==: codewhy的文件,提供更好的提示
- 2.index.html可以配置网页标题和网页图片
- 3.package.json内部可以看启动命令
- 4.css调整,==推荐`npm i normalize.css`==,引入main.js,同时在assets/css中配置通用css(合并进index.css),引入main.js
- 5.配置别名: vite.config.js 下载`npm i @vitejs/plugin-vue`, 然后引入path并配置
  ```
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  ```
- 6.store文件: 配置index.js中的pinia,module内部配置其他store
