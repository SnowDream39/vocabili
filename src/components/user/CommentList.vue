<template>
  <div v-if="comments.length === 0" class="text-gray-500">暂无评论，快来抢沙发！</div>
  <ul class="space-y-4 mb-6">
    <li v-for="comment in comments" :key="comment.id" class="border rounded p-3 bg-gray/50">
      <div class="flex justify-between items-center mb-1">
        <span class="font-medium text-gray-800">{{ comment.username || '匿名' }}</span>
        <span class="text-xs text-gray-400">{{ formatDate(comment.created_at) }}</span>
      </div>
      <p class="whitespace-pre-line text-gray-700">{{ comment.content }}</p>
      <div class="actions text-right text-xs text-gray-400 flex flex-row justify-between text-lg">
        <CommentAction v-bind="actionIcons.reply" />
        <div class="flex flex-row text-lg gap-1">
          <CommentAction v-bind="actionIcons.like" />
          <CommentAction v-bind="actionIcons.dislike" />
          <CommentAction v-bind="actionIcons.share" />
        </div>
      </div>
    </li>
  </ul>
</template>


<script lang="ts" setup>
import {DateTime} from 'luxon'

defineProps<{
  comments: any[]
}>()

function formatDate(dateStr: string) {
  // 假设 dateStr 是 UTC 时间格式，例如 "2025-06-25 10:14:00"
  const d = DateTime.fromISO(dateStr, { zone: 'utc' })  // 解析为 UTC 时间
  const local = d.setZone(DateTime.local().zoneName)    // 转换为本地时间
  return local.toFormat("yyyy-MM-dd HH:mm:ss")
}

const actionIcons = {
  like: {
    classBefore: 'i-material-symbols-thumb-up-outline',
    classAfter: 'i-material-symbols-thumb-up',
    action: () => { },
  },
  reply: {
    classBefore: 'i-material-symbols-reply',
    classAfter: 'i-material-symbols-reply',
    action: () => { },
  },
  dislike: {
    classBefore: 'i-material-symbols-thumb-down-outline',
    classAfter: 'i-material-symbols-thumb-down',
    action: () => { },
  },
  share: {
    classBefore: 'i-material-symbols-share',
    classAfter: 'i-material-symbols-share',
    action: () => { },
  },
}

</script>
