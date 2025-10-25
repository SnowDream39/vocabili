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
  DataZoomComponent,
  MarkLineComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([
  TitleComponent,
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
import type { Form } from '../song/Calculator.vue'
import { Calculator } from '@/utils/calculator'

// 自动切换主题
const dark = useDark()
const theme = computed(() => {
  return dark.value ? 'dark' : 'shine'
})
provide(THEME_KEY, theme);

const props = defineProps<{
  data: Form
}>()

const option = ref<any>({
  title: {
    text: '补正分析'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  legend: {
    // Try 'horizontal'
    orient: 'vertical',
    top: 0,
    right: 0
  },
  dataset: {
    source: [
      { view: 100, point: 1000, viewR: 10, favoriteR: 20, coinR: 30, likeR: 40 }
    ]
  },
  xAxis: [
    { name: '播放', type: 'value', position: 'bottom', nameLocation: 'end' },
],
  yAxis: [
    { name: '分数', position: 'left', nameLocation: 'end' },
    { name: '播放分补正', show: false, },
    { name: '收藏分补正', show: false, },
    { name: '硬币分补正', show: false, },
    { name: '点赞分补正', show: false, },
  ],
  series: [
    { name: '分数', type: 'line', yAxisIndex: 0, smooth: true, showSymbol: false, encode: { x: 'view', y: 'point' },
      markLine: {
        symbol: 'none', // 去掉箭头
        lineStyle: {
          color: '#ff6666',
          width: 1.5,
          type: 'dashed' // 虚线样式
        },
        data: [
          { xAxis: 10000 }
        ]
      }
    },
    { name: '播放分补正', type: 'line', yAxisIndex: 1, smooth: true, showSymbol: false, encode: { x: 'view', y: 'viewR' }},
    { name: '收藏分补正', type: 'line', yAxisIndex: 2, smooth: true, showSymbol: false, encode: { x: 'view', y: 'favoriteR' } },
    { name: '硬币分补正', type: 'line', yAxisIndex: 3, smooth: true, showSymbol: false, encode: { x: 'view', y: 'coinR' } },
    { name: '点赞分补正', type: 'line', yAxisIndex: 4, smooth: true, showSymbol: false, encode: { x: 'view', y: 'likeR' } }
  ],
  dataZoom: [
    { type: 'slider', xAxisIndex: 0 },
    { type: 'inside', xAxisIndex: 0 }
  ]
})

watch(() => props.data, (form) => {
  const chartData: any[] = []
  const {view, favorite, coin, like, copyright, board} = form
  const basis = favorite + coin + like
  for (let i=0.1; i<10; i+=0.1) {
    const view = Math.floor(basis*i)
    const calc = new Calculator(
      {view, favorite, coin, like},
      copyright,
      board
    )
    const {viewR, favoriteR, coinR, likeR} = calc
    chartData.push({
      view,
      point: calc.point,
      viewR,
      favoriteR,
      coinR,
      likeR
    })
  }
  option.value.series[0].markLine.data[0].xAxis = view
  option.value.dataset.source = chartData
}, { immediate: true })

</script>
