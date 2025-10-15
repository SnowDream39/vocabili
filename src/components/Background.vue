<template>
  <div class="fixed inset-0 -z-9999">
    <div id="bg-img" class="absolute inset-0 bg-cover bg-top"></div>
    <div id="bg-filter" class="absolute inset-0 bg-surface opacity-80 mix-blend-lighten dark:mix-blend-darken"></div>
    <div id="test"></div>
  </div>
</template>

<script setup lang="ts">
import { useInitBgManager } from '@/plugins/BackgroundImagePlugin'

useInitBgManager()
</script>


<style scoped>

#bg-img {
  background-image: url('https://h.pixiv.ddns-ip.net/34844544');
  filter: grayscale(50%);
}

</style>
