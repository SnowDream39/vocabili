<template>
  <el-config-provider :locale="zhCn">
    <Header/>
    <main>
      <router-view />
    </main>
    <Footer/>
    <ScrollToTop/>
  </el-config-provider>
</template>

<script setup>
import Header from './components/header/Header.vue';
import Footer from './components/Footer.vue';
import ScrollToTop from './components/misc/ScrollToTop.vue';
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>

<style lang="scss" scoped>
main {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.el-dialog__headerbtn {
  border-radius: 12px;
  color: #8b8b8b;

}

h2 {
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0;
}

</style>
