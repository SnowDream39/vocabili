import { createApp } from 'vue';
import './normalize.css';
import 'element-plus/dist/index.css';
import { ElMessage } from 'element-plus';
import App from './App.vue';
import router from './router';
import 'virtual:uno.css'
import { createPinia } from 'pinia';

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
    showClose: true
  })
}
