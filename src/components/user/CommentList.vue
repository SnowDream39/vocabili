<template>
  <div v-if="comments.length === 0" class="text-gray-500">暂无评论</div>
  <ul class="space-y-4 mb-6">
    <li v-for="comment in comments" :key="comment.id" class="border rounded p-3 bg-gray/10 dark:bg-gray/90!">
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
