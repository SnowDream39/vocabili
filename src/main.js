import { createApp } from 'vue';
import './normalize.css';
import ElementPlus, { ElMessage } from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import App from './App.vue';
import router from './router';
import registerComponents from './plugins/global-components';

const app = createApp(App);

// 注册全局组件
registerComponents(app);

// 使用 Element Plus
app.use(ElementPlus, { locale: zhCn });
app.use(router);


app.mount('#app');

app.config.errorHandler = (err, instance, info) => {  
  console.error('Vue Error:', err)
  ElMessage({
    message: err.message,
    type: 'error',
    duration: 3000, // 3秒后自动消失
    showClose: true
  })
}