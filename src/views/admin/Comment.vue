<template>
  <div class="p-4">
    <el-table :data="comments" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="username" label="用户" width="100" />
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="created_at" label="时间" width="180" >
        <template #default="{ row }">
          {{ formatTime(row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column prop="article_id" label="页面" width="80" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="comments.length === 0" description="暂无评论" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getAllComments, deleteComment } from '@/utils/api/comment'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatTime } from '@/utils/date'

const comments = ref<any[]>([])

async function loadComments() {
  try {
    comments.value = await getAllComments()
  } catch {
    ElMessage.error('加载评论失败')
  }
}

async function handleDelete(id: number) {
  try {
    await ElMessageBox.confirm('确认要删除这条评论吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await deleteComment(id)
    ElMessage.success('删除成功')
    await loadComments()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(loadComments)
</script>
