<template>
  <div class="mx-[600px] w-[90%] p-4 bg-paper rounded shadow">
    <h2 class="text-xl font-semibold mb-4">评论区</h2>

    <!-- 新评论输入 -->
    <CommentInput @refresh="loadComments" />

    <!-- 评论列表 -->
    <CommentList :comments="comments"/>


  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import CommentList from './CommentList.vue'
import CommentInput from './CommentInput.vue'
import { getByArticleId } from '@/utils/comment'
import { usePageStore } from '@/store/page'

const pageStore = usePageStore()

const comments = ref<any[]>([])

const loadComments = async () => {
  const data = await getByArticleId(pageStore.name)
  comments.value = data
}


watch(() => pageStore.name, loadComments)




</script>

<style scoped>
/* 你也可以用全局Tailwind，这里无额外样式 */
</style>
