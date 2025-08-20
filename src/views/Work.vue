<template>
  <h1 class="big-title">数据库STAFF打标</h1>
  <input type="file" @change="handleFileChange" />

  <el-pagination
    v-if="allRecords.length > 0"
    :current-page="currentPage"
    :page-size="pageSize"
    :total="allRecords.length"
    @current-change="currentPage = $event"
  />


  <div class="marking-cards w-[min(800px,90%)] flex flex-nowrap flex-col items-center justify-center">
    <div v-if="allRecords.length > 0" class="w-full text-left my-2">
      <el-switch v-model="allIncluded" @change="handleChangeAll"/> <span>全选/全不选</span>
    </div>
    <MarkingCard v-for="record in pagedData" :key="recordIndex(record)" :record="record" :include-entries="includeEntries" :index="recordIndex(record)" v-model:include="includeEntries[recordIndex(record)]" />
  </div>

  <button class="mt-4" @click="exportToExcel(allRecords)">导出Excel</button>
</template>

<script lang="ts" setup>
import { ElPagination } from "element-plus";
import { ref, computed } from "vue";
import MarkingCard from "@/components/song/MarkingCard.vue";
import * as XLSX from "xlsx";

const allRecords = ref<any[]>([]);       // 全部数据
const pageSize = 20;                     // 每页显示数量
const currentPage = ref(1);
const includeEntries = ref<boolean[]>([]); // 用于记录哪些条目被包含
const allIncluded = ref<boolean>(false);

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

// 上传文件
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    handleFileUpload(target.files[0]);
  }
}

// 使用 Web Worker 解析大文件
function handleFileUpload(file: File) {
  const reader = new FileReader();
  reader.onload = (e: any) => {
    const arrayBuffer = e.target.result;

    const worker = new Worker(new URL("../workers/xlsxWorker.js", import.meta.url), { type: "module" });
    worker.postMessage({ file: arrayBuffer });

    worker.onmessage = (event) => {
      allRecords.value = event.data;
      let length = allRecords.value.length;
      includeEntries.value = new Array(length).fill(true);
      currentPage.value = 1;
      worker.terminate();
      console.log("解析完成，记录数:", length);
    };
  };
  reader.readAsArrayBuffer(file);
}

// 导出 Excel
function exportToExcel(records: any[]) {
  const outputRecords = records.filter((_, index) => includeEntries.value[index]);
  const worksheet = XLSX.utils.json_to_sheet(outputRecords);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "output.xlsx");
}
</script>
