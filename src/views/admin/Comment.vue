<template>
  <div class="p-4">
    <el-table :data="comments" stripe style="width: 95vw;">
      <el-table-column prop="id" label="ID" width="50" />
      <el-table-column prop="username" label="用户" />
      <el-table-column prop="content" label="内容" min-width="200" />
      <el-table-column prop="created_at" label="时间" >
        <template #default="{ row }">
          {{ formatTime(row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column prop="article_id" label="页面"/>
      <el-table-column label="操作" width="80">
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


    <el-pagination
      background
      layout="prev, pager, next, jumper"
      :total="total"
      :pager-count="7"
      :page-size="20"
      v-model:current-page="page"
      class="pagination"
      @current-change="loadComments"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getAllComments, deleteComment } from '@/utils/api/admin'
import { ElMessage, ElMessageBox, ElPagination } from 'element-plus'
import { formatTime } from '@/utils/date'

const comments = ref<any[]>([])
const page = ref<number>(1)
const total = ref<number>(0)
async function loadComments() {
  try {
    comments.value = await getAllComments(page.value, 20)
    if (total.value === 0) total.value = comments.value[0].id
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

<style lang="scss" scoped>

.pagination {
  display: flex;
  justify-content: center;
  padding: 15px 10px;
}

.pagination {
  max-width: 100%;
  font-size: 14px;
}

@media (max-width: 630px) {
  .boardpagination {
    padding: 10px 5px;
  }

  .pagination {
    font-size: 12px;
    :deep(.el-pagination__jump) {
      margin-left: 0;
    }
    :deep(.el-pagination button) {
      min-width: 16px;
    }
    :deep(.el-pager li) {
      min-width: 16px;
    }
  }
}

</style>
