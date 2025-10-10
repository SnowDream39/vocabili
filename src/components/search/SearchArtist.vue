<template>
  <el-table
    :data="data"
    border
    stripe
    class="data-table"
    v-loading="loading"
  >
    <el-table-column prop="name" label="名称" />
    <el-table-column label="操作" width="120" align="center">
        <template #default="{ row }">
          <el-button class="btn-primary" @click="handleDetail(type, row.id)" >
            <div class="i-material-symbols-calendar-month-outline-rounded"></div>
          </el-button>
        </template>
      </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

defineProps(['type','data','loading'])

const loading = ref(false)

const handleDetail = (type: string, id: string) => {
  const fullUrl = window.location.origin + `/artist/${type}/` + id;
  window.open(fullUrl, '_blank');
}


</script>

<style scoped>
.data-table {
  margin: 20px 0;

  .thumbnail-img {
    width: 80px;
    height: 80px;
    border-radius: 4px;
  }

  :deep(.el-table__cell) {
    padding: 12px 0;
  }
}

.pagination {
  margin-top: 24px;
  justify-content: center;
}


</style>
