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
