<template>
  <Vue3Marquee pauseOnHover animateOnOverflowOnly :vertical="false" :duration="5">
    <slot></slot>
  </Vue3Marquee>
</template>

<script></script>

<style>
:deep(.vue3-marquee) {
  overflow-y: hidden !important;
}

:deep(.marquee::after) {
  content: '';
  width: 1em;
}

</style>
