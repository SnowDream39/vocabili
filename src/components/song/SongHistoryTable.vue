<template>
    <el-table
      ref="table"
      :data="data.slice().reverse()"
      :fit="true"
      :row-class-name="rankin"
      :default-sort="{ prop: 'issue', order: 'descending' }"
      max-height="300"
      style="width: 100%; overflow-x: auto;"
    >
      <el-table-column fixed sortable prop="issue" label="期数" min-width="80" >
        <template #default="scope">
          <a style="text-decoration: none;" :href="`/board/${scope.row.board}/${scope.row.issue}`" target="_blank">{{ scope.row.issue }}</a>
        </template>
      </el-table-column>
      <el-table-column sortable prop="rank.board" label="排名" min-width="80" />
      <el-table-column sortable prop="point" label="得分" min-width="90" />
      <el-table-column
        v-for="column in columns"
        sortable
        :key="column.key"
        :label="column.label"
        :sort-method="sortChange(column.key)"
        min-width="125">
        <template #default="scope">
          <span>{{ scope.row.change[column.key] }}</span>
          <span style="float:right">{{ scope.row.rank[column.key] }}位</span>
        </template>
      </el-table-column>
      <template #append>
        <div class="table-append" v-if="!end" >
          <button class="btn-primary" @click="fetchData">继续加载</button>
        </div>
      </template>
    </el-table>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef, watch } from 'vue'
import { requester } from '../../utils/api/requester';

const table = useTemplateRef<any>('table');

// configs
const props = defineProps<{
  songId?: string;
  boardId: string;
}>();
const columns = [
  {key: "view", label: "播放"},
  {key: "favorite", label: "收藏"},
  {key: "coin", label: "硬币"},
  {key: "like", label: "点赞"},
]

// data
const data = ref<any[]>([]);
const index = ref(0);
const end = ref(true);

// methods
async function fetchData() {
  if (!props.songId) return[]
  try {
    index.value += 1;
    const response = await requester.get_song_rank_history(props.songId, props.boardId, 50, index.value);
    data.value.push(...response.result);
    if (index.value * 50 >= response.total) {
      end.value = true;
    } else {
      end.value = false;
    }
  } catch (error) {
    console.log('获取数据失败：', error);
    return [];
  }
}

// template methods
const rankin = (data: any) => {
  if (data.row.rank.board <= 20) {
    return 'rankin-row'
  }
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



// hook
watch(() => props.songId, fetchData, { immediate: true })

</script>

<style lang="scss">
.el-table .rankin-row {
  --el-table-tr-bg-color: var(--el-color-primary-light-7);
}

.table-append {
  text-align: center;
}
</style>
