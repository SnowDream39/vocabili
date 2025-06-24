<template>
  <div class="special-selector__inner">
    <el-select
      v-model="issueInfo"
      value-key="name"
      placeholder="特刊"
      @change="issueChanged"
      style="width: 70%;"
    >
      <el-option
        v-for="item in issues"
        :key="item.name"
        :label="item.name"
        :value="item"
      >{{ item.name }}</el-option>
    </el-select>
    <el-select
      v-model="part"
      placeholder="子榜"
      @change="issueChanged"
      style="width: 20%;">
      <el-option
        v-if="issueInfo"
        v-for="item in Object.keys(issueInfo?.part)"
        :key="item"
        :label="item"
        :value="item"
      >{{ item }}</el-option>
    </el-select>
  </div>
</template>


<script lang="ts" setup>
/**
 * 我现在比较喜欢把组件拆分得比较小
 */
import { onMounted, ref, watch } from 'vue';
import { requester } from '../utils/requester';
import Board from '../utils/board';

const emit = defineEmits();

const issueInfo = ref<any>()
const part = ref<string>('main')

// 列表
const issues = ref<any[]>()

function issueChanged() {
  emit('updateData', {issue: issueInfo.value, part: part.value});
}

async function init() {
  const data = await requester.get_board_metadata(new Board('vocaloid-special'));
  issues.value = data.catalog;
}

onMounted(init)

watch(issueInfo, () => {
  part.value = Object.keys(issueInfo.value.part)[0];
})

/**
 * 呃，我觉得有点乱
 */
</script>

<style lang="scss" scoped>

</style>
