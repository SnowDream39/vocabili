<template>
        <div class="flex justify-between items-center mb-1">
        <span class="font-medium text-gray-800">{{ comment.username || '匿名' }}</span>
        <span class="text-xs text-gray-400">{{ formatTime(comment.created_at) }}</span>
      </div>
      <p class="whitespace-pre-line text-gray-700">{{ comment.content }}</p>
      <div class="actions text-right text-xs text-gray-400 flex flex-row justify-between text-lg">
        <CommentReplyButton v-bind="comment.id" v-model="replyActive" />
        <div class="flex flex-row text-lg gap-1">
          <CommentLikeButton :id="comment.id" v-model="likeActive" />
        </div>
      </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { postLike } from '@/utils/comment';
import CommentLikeButton from './CommentLikeButton.vue';
import CommentReplyButton from './CommentReplyButton.vue';
import { formatTime } from '@/utils/date';

const props = defineProps<{comment: any}>()
const replyActive = ref<boolean>(false)
const likeActive = ref<boolean>(props.comment.liked)

const actions = {
  like: {
    classBefore: 'i-material-symbols-thumb-up-outline',
    classAfter: 'i-material-symbols-thumb-up',
    actionBefore: () => { postLike(props.comment.id) },
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

actions

</script>
