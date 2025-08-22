<template>
  <div>
    <!-- 已选择的标签 -->
    <div class="mb-2">
      <el-tag
        v-for="(tag, index) in tags"
        :key="index"
        closable
        @close="removeTag(index)"
        class="mr-2"
      >
        {{ tag }}
      </el-tag>
    </div>

    <!-- 输入框 + 搜索 -->
    <el-autocomplete
      v-model="input"
      :fetch-suggestions="querySearch"
      placeholder="输入标签..."
      @select="handleSelect"
      :select-when-unmatched="true"
      clearable
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue"
import { ElMessage } from "element-plus"
import { requester } from "@/utils/api/requester";

const props = defineProps<{
  type: string
}>()

const value = defineModel<string>({required: true})

// 标签列表
const tags = ref<string[]>([])
// 输入框
const input = ref<string>("")

// ============ 交互操作逻辑 ==========

// 模拟搜索 API
async function apiSearch(query: string): Promise<string[]> {
  const response: any = await requester.search_artist(props.type, query)
  return response.result.map((item: any) => item.target.name)
}

// 防抖定时器
let timer: any = null
async function querySearch(query: string, cb: any) {
  clearTimeout(timer)
  timer = setTimeout(async () => {
    if (!query) {
      cb([])
      return
    }
    const results = await apiSearch(query)
    cb(results.map((item: string) => ({ value: item })))
  }, 1000) // 1 秒防抖
}

// 选择结果
function handleSelect(item: { value: string }) {
  if (!tags.value.includes(item.value)) {
    tags.value.push(item.value)
  } else {
    ElMessage.warning("已经添加过该标签了")
  }
  input.value = ""
}

// 删除标签
function removeTag(index: number) {
  tags.value.splice(index, 1)
}

// =========== 底层 ==========

onMounted(() => {
  if (value.value) {
    tags.value = value.value.split("、")
  }
})

watch(() => tags.value.length, () => {
  value.value = tags.value.join("、")
  console.log("标签：", value.value)
})



</script>
