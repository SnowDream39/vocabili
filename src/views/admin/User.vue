<template>
  <div class="p-4">
    <el-table :data="users" stripe style="width: 95vw;">
      <el-table-column prop="id" label="ID" width="50" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="is_superuser" label="管理员">
        <template #default="{ row }">
          <el-switch v-model="row.is_superuser" @change="row.handleAdminChange" />
        </template>
      </el-table-column>
      <el-table-column prop="is_premium" label="会员"/>
      <el-table-column prop="premium_end_at" label="会员到期" >
        <template #default="{ row }">
          {{ formatTime(row.premium_end_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template #default="{ row }">
          <el-button
            size="small"
            type="primary"
            @click="handleCharge(row.id)"
          >
            充值
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="users.length === 0" description="暂无评论" />


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
import { getAllUsers, chargePremium, setAdmin, unsetAdmin } from '@/utils/api/admin'
import { ElMessage, ElMessageBox, ElPagination } from 'element-plus'
import { formatTime } from '@/utils/date'
import { useStatusStore } from '@/store/status'

const status = useStatusStore()

const users = ref<any[]>([])
const page = ref<number>(1)
const total = ref<number>(0)
async function loadComments() {
  try {
    users.value = await getAllUsers(page.value, 20)
    if (total.value === 0) total.value = users.value[0].id
    for (const user of users.value) {
      user.handleAdminChange = async (newState: boolean) => {
        try {
          if (newState) {
            await setAdmin(user.id)
            ElMessage.success('恭喜用户 ' + user.username + ' 成为尊贵的管理员')
          } else {
            console.log(user.id, status.userId)
            if (user.id === status.userId) {
              await ElMessageBox.confirm('你真的要取消自己的管理员权限？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
              })
            }
            await unsetAdmin(user.id)
            ElMessage.info('用户 ' + user.username + ' 被剥夺管理员权限')
          }
        } catch {
          ElMessage.error('操作失败')
          user.is_superuser = true
        }
      };
    }
  } catch {
    ElMessage.error('加载用户失败')
  }
}

async function handleCharge(id: number) {
  try {
    await ElMessageBox.confirm('确认要给此用户充值会员30天吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await chargePremium(id, 30)
    ElMessage.success('充值成功')
    await loadComments()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('充值失败')
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
