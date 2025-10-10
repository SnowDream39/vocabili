import { createApp } from 'vue';
import './normalize.css';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css'
import { ElMessage } from 'element-plus';
import App from './App.vue';
import router from './router';
import './assets/styles.css'
import 'virtual:uno.css'
import '@unocss/reset/normalize.css'

import { createPinia } from 'pinia';
import BackgroundImageManager from './plugins/BackgroundImageManager';

const app = createApp(App);


app.use(router);
app.use(createPinia());

app.mount('#app');

app.config.errorHandler = (err: any) => {
  console.error('Vue Error:', err)
  ElMessage({
    message: err.message,
    type: 'error',
    duration: 3000, // 3秒后自动消失
    showClose: true,
    offset: 66
  })
}

// 监听深色模式
const media = window.matchMedia('(prefers-color-scheme: dark)')

function updateTheme() {
  if (media.matches) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

updateTheme() // 初始化一次
media.addEventListener('change', updateTheme)

// 处理背景图片

export const bgManager = new BackgroundImageManager()
