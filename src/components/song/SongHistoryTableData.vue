<template>
    <el-table
      ref="table"
      :data="props.data.slice().reverse()"
      :fit="true"
      :row-class-name="rankin"
      :default-sort="{ prop: 'issue', order: 'descending' }"
      max-height="300"
      style="width: 100%; overflow-x: auto;"
    >
      <el-table-column fixed sortable prop="issue" label="期数" min-width="80" >
        <template #default="scope">
          <a style="text-decoration: none;" :href="`/board/${scope.row.board}/${scope.row.issue}`">{{ scope.row.issue }}</a>
        </template>
      </el-table-column>
      <el-table-column sortable prop="rank" label="排名" min-width="80" />
      <el-table-column sortable prop="point" label="得分" min-width="90" />
      <el-table-column
        v-for="column in columns"
        sortable
        :key="column.key"
        :label="column.label"
        :sort-method="sortChange(column.key)"
        min-width="125">
        <template #default="scope">
          <span>{{ scope.row[column.key] }}</span>
          <span style="float:right">{{ scope.row[`${column.key}_rank`] }}位</span>
        </template>
      </el-table-column>
    </el-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus';
import type { Ranking } from '@/utils/RankingTypes';

const table = ref('table');

const emit = defineEmits(['send-data'])

// =========== 配置 ============
const props = defineProps<{
  data: Ranking[],
}>();
const columns = [
  {key: "view", label: "播放"},
  {key: "favorite", label: "收藏"},
  {key: "coin", label: "硬币"},
  {key: "like", label: "点赞"},
]


// template methods
const rankin = (data: any) => {
  return data.row.rank.board <= 20 ? 'rankin-row' : ''
}

function sortChange(key: string) {
  return (a: any, b: any) => {
    const changeA = a.change[key];
    const changeB = b.change[key];
    // 比较 change 值来进行排序
    if (changeA < changeB) return -1;
    if (changeA > changeB) return 1;
    return 0;
  };
}


</script>

<style lang="scss">
.el-table .rankin-row {
  --el-table-tr-bg-color: var(--md-sys-color-surface-variant);
}

.table-append {
  text-align: center;
}
</style>
