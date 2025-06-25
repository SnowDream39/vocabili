<template>
  <div class="text-lg rounded-2 hover:bg-gray/50" :class="dynamicClass" @click="click"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { postLike, deleteLike } from '../../utils/comment'

const props = defineProps<{
  id: number
}>()

const active = defineModel<boolean>()
const dynamicClass = computed(() => {
  return active.value
   ? 'i-material-symbols-thumb-up'
  : 'i-material-symbols-thumb-up-outline'
})

const click = () => {
  if (active.value) {
    deleteLike(props.id);
  } else {
    postLike(props.id);
  }
  active.value = !active.value;
}

</script>

