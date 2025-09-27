<template>
  <div class="w-full flex flex-row justify-center gap-2">
    <template v-if="change === 'new'">
      <span class="new hidden sm:block ">N E W !!</span>
      <span class="new sm:hidden">NEW!!</span>
    </template>
    <template v-else>
      <span :class="changeClass">{{ changeIcon }}</span>
      <span class="rank_before">{{ rankBefore }}</span>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['rankBefore', 'change']);

const changeClass = computed(() => props.change);
const changeIcon = computed(() => ({
  up: "▲",
  cont: "◆",
  down: "▼"
})[props.change]);
</script>


<style lang="scss" scoped>
.new {
  color: red;
}
.up {
  color: red;
}
.cont {
  color: grey;
}
.down {
  color: blue;
}
</style>
