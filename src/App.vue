<template>
  <!-- <SideAdvertisement/> -->
  <Header/>
  <main>
    <router-view />
  </main>
  <Footer/>
  <ScrollToTop/>
</template>

<script setup>
import ScrollToTop from './components/ScrollToTop.vue';
import SideAdvertisement from './components/SideAdvertisement.vue';



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
