<template>
  <VChart class="h-100 rounded-xl" :autoresize="true" :option="option" ref="chartRef" />
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
  MarkLineComponent,
  MarkAreaComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  GridComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkAreaComponent,
  LineChart,
  CanvasRenderer
])



//  ===========  以上是工具生成部分   ===============

import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide, computed, watch } from "vue";
import { useDark } from "@vueuse/core";
import { startTimeOf } from '@/utils/date'
import type { BasicSection } from '@/utils/board'
import type { Stats } from './CalcChart.vue'

const chartRef = ref()

// 自动切换主题
const dark = useDark()
const theme = computed(() => {
  return dark.value ? 'dark' : 'shine'
})
provide(THEME_KEY, theme);

const props = defineProps<{
  data: any
  boardId: string
  log?: boolean
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
    right: 0,
    selected: {
      '排名': true,
      '播放': true,
      '收藏': true,
      '投币': true,
      '点赞': true
    }
  },
  dataset: {
    source: [{
      issue: 1,
      date: '2024-07-01',
      rank: 1,
      view: 10000,
      favorite: 1000,
      coin: 2000,
      like: 1000,
    }]
  },
  xAxis: [
    {
      type: 'value',
      min: 'dataMin',
      max: 'dataMax',
      position: 'top',
      nameLocation: 'end',
      axisTick: { alignWithLabel: true },
      axisLine: { onZero: false }
    },
    {
      type: 'category',
      nameLocation: 'start',
      position: 'bottom',
      axisLabel: { rotate: 45 },
      axisTick: { alignWithLabel: true },
      axisLine: { show: true, onZero: false },
      data: ['2024-07-01']
    }
],
  yAxis: [
    { min: 1, inverse: true, show: false, type: 'value' },
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
      },
      markArea: {
        itemStyle: {
          color: 'rgba(255, 173, 177, 0.4)'
        },
        data: [
          [{xAxis: 430}, {xAxis: 450}],
          [{xAxis: 455}, {xAxis: 460}],
        ]
      }
    },
    { name: '播放', type: 'line', yAxisIndex: 1, encode: { x: 'issue', y: 'view' } },
    { name: '收藏', type: 'line', yAxisIndex: 2, encode: { x: 'issue', y: 'favorite' }, },
    { name: '投币', type: 'line', yAxisIndex: 2, encode: { x: 'issue', y: 'coin' } },
    { name: '点赞', type: 'line', yAxisIndex: 2, encode: { x: 'issue', y: 'like' } },
  ],
  dataZoom: [
    { type: 'slider', xAxisIndex: [0, 1] },
    { type: 'inside', xAxisIndex: [0, 1] }
  ],
})

interface RankItem extends Stats {
  issue: number
  date: string
  rank: number
}

watch(() => props, (value) => {
  const sortedData: RankItem[] = value.data
    .map((item: any) => ({
      issue: item.issue,
      date: startTimeOf(item.issue, props.boardId.split('-')[1] as BasicSection).toISODate(),
      rank: item.rank.board,
      view: item.change.view,
      favorite: item.change.favorite,
      coin: item.change.coin,
      like: item.change.like,
    })).toSorted((a: any, b: any) => a.issue - b.issue)
  option.value.dataset.source = sortedData
  // 设置时间轴（目前还是有点问题）
  option.value.xAxis[1].data = sortedData.map((d: any) => d.date)
  // 设置对数y轴
  option.value.yAxis.forEach(item => {item.type = value.log ? 'log' : 'value'});
  // 设置入榜显示
  if (sortedData.length >= 1) {
    const rankins: any = []
    let currentIn = false
    let start = 1
    sortedData.forEach(item => {
      if (!currentIn && item.rank <= 20) {
        currentIn = true
        start = item.issue
      } else if (currentIn && item.rank > 20) {
        currentIn = false
        rankins.push([{xAxis: start-0.5}, {xAxis: item.issue-0.5}])
      }
    });
    if (currentIn) {
      rankins.push([{xAxis: start-0.5}, {xAxis: sortedData.at(-1)!.issue}])
    }
    option.value.series[0].markArea!.data = rankins
  }

}, { immediate: true, deep: true })

function getOption() {
  return chartRef.value.getOption()
}

defineExpose({
  getOption
})


</script>
