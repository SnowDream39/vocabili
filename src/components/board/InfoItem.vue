<template>
  <div class="info-item" :title="value">
    <div class="info-item-name">{{ name }}</div>
    <template v-if="append">
      <div class="info-short-value">{{ value }}</div>
      <div class="info-append">{{ append }}</div>
    </template>
    <div v-else class="info-long-value">{{ value }}</div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  name: string,
  value: string,
  append?: string
}>()
</script>

<style lang="scss" scoped>
* {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.info-item {
  display: inline-flex;
}
.info-item-name {
  width: 3em;
}
.info-long-value{
  width: 9em;
}
.info-short-value {
  width: 5em;
}
.info-append {
  width: 4em;
}
</style>