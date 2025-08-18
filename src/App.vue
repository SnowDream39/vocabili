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
import Header from './components/header/Header.vue';
import ScrollToTop from './components/misc/ScrollToTop.vue';
import SideAdvertisement from './components/misc/SideAdvertisement.vue';
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
  max-width: 1000px;
}

.el-dialog__headerbtn {
  border-radius: 12px;
  color: #8b8b8b;

}
</style>
