<template>
  <HeaderMenu v-if="isDesktop" />
  <HeaderDrawer v-else />

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import HeaderMenu from './HeaderMenu.vue';
import HeaderDrawer from './HeaderDrawer.vue';

const isDesktop = ref(window.innerWidth > 768)


onMounted(() => {

  window.addEventListener('resize', () => {
    const width = window.innerWidth

    // 你可以在这里执行你想要的逻辑
    if (width <= 768) {
      isDesktop.value = false
      main.style.marginTop = '';
    } else {
      isDesktop.value = true
      main.style.marginTop = '50px';
    }
  })
  const main = document.querySelector('main') as HTMLElement;
  if (isDesktop.value) {
    main.style.marginTop = '50px';
  }

})


</script>

