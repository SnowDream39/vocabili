<template>
    <!-- 数据表格 -->
    <el-table
      :data="data"
      border
      stripe
      class="data-table"
      v-loading="loading"
    >
      <el-table-column label="封面" min-width="60" align="center">
        <template #default="{ row }">
          <el-image
            :src="`${row.thumbnail}@300w`"
            :preview-src-list="[row.thumbnail]"
            fit="cover"
            preview-teleported
            class="thumbnail-img"
          />
        </template>
      </el-table-column>

      <el-table-column prop="name" label="歌曲名称" min-width="60" />
      <el-table-column prop="vocalist" label="歌手" min-width="60" />
      <el-table-column prop="producer" label="作者" min-width="60" />

      <el-table-column label="操作" width="60" align="center">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="handleDetail(row.id)"
            class="detail-btn"
          />
        </template>
      </el-table-column>
    </el-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

defineProps(['data', 'loading'])


const loading = ref(false)


const handleDetail = (id: string) => {
  window.open(`${window.location.origin}/song/${id}`, '_blank')
}


</script>

<style scoped>
.data-table {
  width: 95vw;
  margin: 20px 0;

  .thumbnail-img {
    aspect-ratio: 16 / 9;
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
