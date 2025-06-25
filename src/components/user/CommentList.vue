<template>
  <div v-if="comments.length === 0" class="text-gray-500">暂无评论，快来抢沙发！</div>
  <ul class="space-y-4 mb-6">
    <li v-for="comment in comments" :key="comment.id" class="border rounded p-3 bg-gray/50">
      <Comment :comment="comment" />
    </li>
  </ul>
</template>


<script lang="ts" setup>
import Comment from './Comment.vue';


defineProps<{
  comments: any[]
}>()


</script>
