<template>
  <VChart class="h-100 rounded-xl" :autoresize="true" :option="option" />
</template>

<script setup lang="ts">
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  GridComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer
])



//  ===========  以上是工具生成部分   ===============

import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide, computed, watch } from "vue";
import { useDark } from "@vueuse/core";

// 自动切换主题
const dark = useDark()
const theme = computed(() => {
  return dark.value ? 'dark' : 'shine'
})
provide(THEME_KEY, theme);

const props = defineProps<{
  data: any
}>()

const option = ref({
  tooltip: {
    trigger: 'axis',     // ✅ 改成 'axis' 就能同时显示同一 x 值的所有系列
    axisPointer: {
      type: 'cross'      // 可选：让指示线是十字准星样式
    }
  },
  legend: {
    // Try 'horizontal'
    orient: 'vertical',
    left: 0,
    bottom: 0
  },
  dataset: {
    source: []
  },
  xAxis: { type: 'category' },
  yAxis: [
    { minInterval: 1, inverse: true, show: false },
    { name: '播放', position: 'left' },
    { name: '收/币/赞', position: 'right' }
  ],
  series: [
    { name: '排名', type: 'line', yAxisIndex: 0, },
    { name: '播放', type: 'line', yAxisIndex: 1, },
    { name: '收藏', type: 'line', yAxisIndex: 2, },
    { name: '投币', type: 'line', yAxisIndex: 2, },
    { name: '点赞', type: 'line', yAxisIndex: 2, },
  ],
  dataZoom: [
    { type: 'slider', xAxisIndex: 0 },
    { type: 'inside', xAxisIndex: 0 }
  ]
})

watch(() => props.data, (value) => {
  option.value.dataset.source = value.dataset
    .map((item: any) => ({
      issue: item.issue,
      rank: item.rank.board,
      view: item.change.view,
      favorite: item.change.favorite,
      coin: item.change.coin,
      like: item.change.like,
    })).toSorted((a: any, b: any) => a.issue - b.issue)
}, { immediate: true })

</script>
