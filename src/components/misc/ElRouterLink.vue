<template>
  <el-link
    :underline="false"
    :type="type"
    :class="{ 'is-disabled': disabled }"
    @click="handleClick"
  >
    <slot />
  </el-link>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const props = defineProps<{
  to: string
  disabled?: boolean
  type: string
}>()

const router = useRouter()
function handleClick() {
  if (!props.disabled) router.push(props.to)
}
</script>
