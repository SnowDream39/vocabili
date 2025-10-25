<template>
  <div class="suspend-panel p-4">
    <Calculator :form="form" :hide-button="true" @send-points="handlePoints" />
  </div>
  <div class="px-4 w-full max-w-200">
    <PointChart :data="form" ></PointChart>
  </div>
</template>

<script setup lang="ts">
import Board from '@/utils/board';
import { useRoute } from 'vue-router';
import Calculator, { type Form } from '@/components/song/Calculator.vue';
import { ref } from 'vue';
import PointChart from '@/components/chart/PointChart.vue';

/**
 * 如果URL给出了完整的一个表，那么就返回。否则给一个默认的
 */
function getForm(): Form {
  const route = useRoute()
  if (route.query && route.query.view) {
    const { view, favorite, coin, like, copyright, boardId, issue } = route.query as unknown as {
      view: number,
      favorite: number,
      coin: number,
      like: number,
      copyright: number,
      boardId: string,
      issue: number
    }
    const board = new Board(boardId, Number(issue))
    return {
      view: Number(view),
      favorite: Number(favorite),
      coin: Number(coin),
      like: Number(like),
      copyright: Number(copyright),
      board
    }
  } else {
    return {
      view: 0,
      favorite: 0,
      coin: 0,
      like: 0,
      copyright: 1,
      board: new Board('vocaloid-daily')
    }
  }
}

const form = ref<Form>(getForm())
const chartData = ref<any>()

function handlePoints(points: any) {
  chartData.value = points
  console.log('received')
}
</script>
