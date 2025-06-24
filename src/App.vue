<template>
  <el-config-provider :locale="zhCn">
    <!-- <SideAdvertisement/> -->
    <Header/>
    <main>
      <router-view />
    </main>
    <Footer/>
    <ScrollToTop/>
  </el-config-provider>
</template>

<script setup>
import Header from './components/Header.vue';
import ScrollToTop from './components/ScrollToTop.vue';
import SideAdvertisement from './components/SideAdvertisement.vue';
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'


</script>

<style lang="scss" scoped>
main {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
}

.el-dialog__headerbtn {
  border-radius: 12px;
  color: #8b8b8b;

}
</style>
