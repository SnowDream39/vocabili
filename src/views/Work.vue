<template>
  <div class="px-4 flex flex-col items-center">
    <h1 class="big-title">数据库STAFF打标</h1>
    <el-switch v-if="status == 'waiting'" v-model="svmode" active-text="SV榜模式"></el-switch>
    <input type="file" class="[&::file-selector-button]:btn-primary" @change="handleFileChange" />

    <div v-if="allRecords.length > 0" class="w-full text-left my-2">
      <el-switch v-model="allIncluded" @change="handleChangeAll"/> <span>全选/全不选</span>
    </div>
    <div :v-loading="status == 'loading'" class="marking-cards min-h-50 flex flex-wrap items-start justify-center gap-4">
      <MarkingCard
        v-for="record in pagedData"
        :key="recordIndex(record)"
        :svmode="svmode"
        :record="record"
        :include-entries="includeEntries"
        :index="recordIndex(record)"
      />
    </div>

    <el-pagination
      v-if="allRecords.length > 0"
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="allRecords.length"
      @current-change="handlePageChanged"
    />
    <button class="btn-primary" @click="exportToExcel(allRecords)">导出Excel</button>
  </div>
</template>

<script lang="ts" setup>
import { ElPagination, ElSwitch } from "element-plus";
import { ref, computed } from "vue";
import MarkingCard from "@/components/song/MarkingCard.vue";
import * as XLSX from "xlsx";
import { useTitle } from "@vueuse/core";

useTitle('打标工具 | 术力口数据库')
const allRecords = ref<any[]>([]);       // 全部数据
const pageSize = 20;                     // 每页显示数量
const currentPage = ref(1);
const includeEntries = ref<boolean[]>([]); // 用于记录哪些条目被包含
const allIncluded = ref<boolean>(false);
const status = ref<string>('waiting')
const svmode = ref<boolean>(false)

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return allRecords.value.slice(start, start + pageSize);
});

function recordIndex(record: any) {
  return allRecords.value.indexOf(record);
}

function handleChangeAll() {
  includeEntries.value = includeEntries.value.map(() => allIncluded.value);
}

const handlePageChanged = async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 上传文件
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    handleFileUpload(target.files[0]);
  }
}

// 使用 Web Worker 解析大文件
function handleFileUpload(file: File) {
  status.value = 'loading'
  const reader = new FileReader();
  reader.onload = (e: any) => {
    const arrayBuffer = e.target.result;

    const worker = new Worker(new URL("../workers/xlsxWorker.js", import.meta.url), { type: "module" });
    worker.postMessage({ file: arrayBuffer });

    worker.onmessage = (event) => {
      allRecords.value = event.data;
      let length = allRecords.value.length;
      if (svmode.value){
        includeEntries.value = new Array(length).fill(true);
      } else {
        includeEntries.value = allRecords.value.map((item: any) => ['done', 'auto'].includes(item.status))
      }
      currentPage.value = 1;
      worker.terminate();
      console.log("解析完成，记录数:", length);
      status.value = 'loaded'
    };
  };
  reader.readAsArrayBuffer(file);
}

// 导出 Excel
function exportToExcel(records: any[]) {
  let outputRecords;
  if (svmode.value) {
    outputRecords = records.map((item, index) => {
      item.include = includeEntries.value[index] ? '收录' : '排除'
      return item
    });
  } else {
    outputRecords = records.filter((_, index) => includeEntries.value[index]);
  }
  console.log(outputRecords.slice(0,2))
  const worksheet = XLSX.utils.json_to_sheet(outputRecords);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "output.xlsx");
}
</script>

<style scoped>
input::file-selector-button {
  padding: 0.5em;
  border-radius: 10px;
}
</style>
