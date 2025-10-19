<template>
 <div class="[&:hover_.back-thumbnail]:scale-120 overflow-hidden relative rounded-xl border-2 text-shadow-md text-shadow-white dark:text-shadow-black shadow-xl font-500 dark:shadow-none" style="font-family: '思源黑体', '思源黑体 CN', sans-serif;">
  <div class="back-thumbnail absolute w-full h-full center-container transition">
    <slot name="back"></slot>
  </div>
  <div class="absolute inset-0 bg-white/50 dark:bg-black/50"></div>
  <div class="relative z-10">
    <slot name="front"></slot>
  </div>
  <slot></slot>
 </div>
</template>

<script setup lang="ts">

</script>
