<template>
  <Vue3Marquee pauseOnHover animateOnOverflowOnly :vertical="false" :duration="5">
    <slot></slot>
  </Vue3Marquee>
</template>

<script>
import { Vue3Marquee } from 'vue3-marquee';

</script>

