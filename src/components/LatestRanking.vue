<template>
  <div class="w-full max-w-full px-2 shrink-0">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(value, board) in boardMap" :name="board" :label="value.name">
        <div class="min-h-[300px]">
          <div v-if="value.data && value.data.length > 0">
            <ol>
              <li v-for="item in value.data" class="flex flex-nowrap justify-between items-center h-14 py-2 hover:bg-surface-variant cursor-pointer" @click="navigateToSong(item)">
                <div class="h-full flex flex-nowrap items-center gap-2 min-w-0 flex-1">
                  <div class="w-8 text-center flex-shrink-0">{{ item.rank }}</div>
                  <div class="aspect-ratio-16/9 h-full rounded-md overflow-hidden flex-shrink-0">
                    <img :src="item.video.thumbnail" referrerpolicy="no-referrer" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="truncate">{{ item.song.name }}</div>
                    <div class="text-sm text-on-surface-variant truncate">{{ item.song.producers.map(item => item.name).join('、') }}</div>
                  </div>
                </div>
                <div class="text-sm text-on-surface-variant flex-shrink-0 ml-2">{{ item.point.toLocaleString() }} pt</div>
              </li>
            </ol>
            <div class="w-full flex justify-end px-2 mt-4">
              <ElRouterLink :to="`/board/${board}/${value.issue}`" type="primary">&gt;&gt;更多</ElRouterLink>
            </div>
          </div>
          <div v-else>
            <el-skeleton :rows="14" animated style="height: 597px" />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script setup lang="ts">
import Board, {  type SequentialBoard } from '@/utils/board';
import { ref, watch } from 'vue';
import { ElTabs, ElTabPane, ElSkeleton } from 'element-plus';
import ElRouterLink from './misc/ElRouterLink.vue';
import api from '@/utils/api/api';
import type { Ranking } from '@/utils/RankingTypes';
import type { DateTime } from 'luxon';
import { useRouter } from 'vue-router';

const router = useRouter()
const props = defineProps<{
  today: DateTime | null
}>()

const activeName = ref('vocaloid-daily')
const boardMap = ref<Record<SequentialBoard, {
  name: string,
  issue: number,
  data: Ranking[] | null
}>>({
  'vocaloid-daily': { name: '日刊', issue: 1, data: null  },
  'vocaloid-weekly': { name: '周刊', issue: 1, data: null },
  'vocaloid-monthly': { name: '月刊', issue: 1, data: null },
})

function navigateToSong(item: Ranking) {
  console.log(item)
  router.push(`/song/${item.song_id}`);
}

watch(props, async () => {
  if (props.today) {
    const promises = []
    for (const board of ['vocaloid-daily', 'vocaloid-weekly', 'vocaloid-monthly'] as SequentialBoard[]) {
      promises.push(api.getLatestRanking(board).then(data => {
        boardMap.value[board].issue = data
        api.getRanking(new Board(board, 'main', data), 1, 10).then(data => {
          boardMap.value[board].data = data.data
        })
      }))
    }
    await Promise.all(promises)
  }
})

</script>
