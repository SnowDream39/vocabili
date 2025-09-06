<template>
  <template v-if="change === 'new'">
    <span class="new">N E W !!</span>
  </template>
  <template v-else>
    <span :class="changeClass">{{ changeIcon }}</span>
    <span class="rank_before">{{ rankBefore }}</span>
  </template>
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
