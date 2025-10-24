<template>
  <VChart class="h-100 rounded-xl" :autoresize="true" :option="option" />
</template>

<script setup lang="ts">
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  GridComponent,
  DataZoomComponent,
  MarkLineComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  GridComponent,
  DataZoomComponent,
  MarkLineComponent,
  LineChart,
  CanvasRenderer
])


//  ===========  以上是工具生成部分   ===============

import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide, computed, watch } from "vue";
import { useDark } from "@vueuse/core";
import { startTimeOf } from '@/utils/date'

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
    bottom: 0,
    right: 0
  },
  dataset: {
    source: []
  },
  xAxis: [
    { type: 'category', position: 'top', nameLocation: 'end' },
    {
      type: 'category',
      nameLocation: 'start',
      position: 'bottom',
      axisLabel: { rotate: 45 },
      // ✅ 让两个 x 轴数据对齐
      axisTick: { alignWithLabel: true },
      // ✅ 不显示轴线（根据审美可选）
      axisLine: { show: true },
      // ✅ 使用 dataset 中的维度名称来匹配
      // 如果不指定，会自动使用第一个维度
      data: []
    }
],
  yAxis: [
    { minInterval: 1, inverse: true, show: false },
    { name: '播放', position: 'left', nameLocation: 'middle' },
    { name: '收/币/赞', position: 'right', nameLocation: 'middle' }
  ],
  series: [
    { name: '排名', type: 'line', yAxisIndex: 0, encode: { x: 'issue', y: 'rank' },
      markLine: {
        symbol: 'none', // 去掉箭头
        label: {
          show: true,
          position: 'start',
          formatter: '入榜' // 横线的名字
        },
        lineStyle: {
          color: '#ff6666',
          width: 1.5,
          type: 'dashed' // 虚线样式
        },
        data: [
          { yAxis: 20 } // ✅ 在 y=20 位置画横线
        ]
      }
    },
    { name: '播放', type: 'line', yAxisIndex: 1, encode: { x: 'issue', y: 'view' } },
    { name: '收藏', type: 'line', yAxisIndex: 2, encode: { x: 'issue', y: 'favorite' } },
    { name: '投币', type: 'line', yAxisIndex: 2, encode: { x: 'issue', y: 'coin' } },
    { name: '点赞', type: 'line', yAxisIndex: 2, encode: { x: 'issue', y: 'like' } },
  ],
  dataZoom: [
    { type: 'slider', xAxisIndex: [0, 1] },
    { type: 'inside', xAxisIndex: [0, 1] }
  ]
})

watch(() => props.data, (value) => {
  console.log(startTimeOf(value.dataset[0].issue, value.boardId.split('-')[1]).toISODate())
  const sortedData = value.dataset
    .map((item: any) => ({
      issue: item.issue,
      date: startTimeOf(item.issue, value.boardId.split('-')[1]).toISODate(),
      rank: item.rank.board,
      view: item.change.view,
      favorite: item.change.favorite,
      coin: item.change.coin,
      like: item.change.like,
    })).toSorted((a: any, b: any) => a.issue - b.issue)
  option.value.dataset.source = sortedData
  option.value.xAxis[1].data = sortedData.map((d: any) => d.date)
}, { immediate: true })

</script>
