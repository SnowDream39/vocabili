<template>
  <VChart class="h-auto rounded-xl" :autoresize="true" :option="option" />
</template>

<script setup lang="ts">
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

use([PieChart, CanvasRenderer])


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

export interface Stats {
  view: number
  favorite: number
  coin: number
  like: number
}

const props = defineProps<{
  data: Stats
}>()

const option = ref({


  series: [
    {
      type: 'pie',
      data: [{ value: 1, name: '全部' }]
    }
  ],

})

watch(() => props.data, (value) => {
  if (value) {
    console.log(value.view)
    option.value.series[0].data = [
      { value: value.view, name: '播放分' },
      { value: value.favorite, name: '收藏分' },
      { value: value.coin, name: '投币分' },
      { value: value.like, name: '点赞分' },
    ]
  }
}, { immediate: true })

</script>
