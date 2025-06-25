<template>
    <form @submit.prevent="submitComment" class="space-y-2 mb-4">
      <textarea v-model="newComment" placeholder="写下你的评论..." rows="4"
        class="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        required></textarea>

      <button type="submit"
        class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
        :disabled="loading">
        {{ loading ? '提交中...' : '发表评论' }}
      </button>
    </form>
</template>


<script setup lang="ts">
import { post } from '@/utils/comment';
import { ref } from 'vue';
import { usePageStore } from '@/store/page';
const pageStore = usePageStore()

const newComment = ref('')
const emit = defineEmits<{
  refresh: []
}>()

const loading = ref(false)
const error = ref<string | null>(null)

async function submitComment() {
  if (!newComment.value.trim()) return
  loading.value = true
  error.value = null

  try {
    // 这里你写接口请求，把 newComment.value 发给后端
    // 模拟请求延迟：
    const response = await post({
      content: newComment.value,
      article_id: pageStore.name
    })

    console.log(response)
    newComment.value = ''

    emit('refresh')
  } catch {
    error.value = '提交失败，请稍后再试'
  } finally {
    loading.value = false
  }
}

</script>
