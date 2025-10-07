<template>
  <span :class="changeClass">
    <span>（</span>
    <template v-if="change === 'new'">
      <span>NEW!!</span>
    </template>
    <template v-else>
      <span>{{ changeIcon }}</span>
      <span>{{ rankBefore }}</span>
    </template>
    <span>）</span>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['rankBefore', 'change']);

const changeClass = computed(() => props.change);
const changeIcon = computed(() => ({
  up: "↑",
  cont: "→",
  down: "↓"
})[props.change]);
</script>


<style>
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
