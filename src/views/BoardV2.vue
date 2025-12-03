<template>
  <div class="max-w-full flex flex-row flex-nowrap gap-4 items-start">
    <div class="flex flex-col items-center w-full lg:w-[964px]" >
      <div class="w-full text-center mb-4">
        <div v-if="!isSpecial">
          <div id="last-next-issues">
            <el-router-link :to="`/board/${board.fullId}/${board.issue-1}?page=1`" type="primary" id="last-issue" :disabled="!lastIssueStatus">&lt;&lt;上一期</el-router-link>
            <button class="text-primary" @click="changeBoard" id="change-board">切换总榜/新曲榜</button>
            <el-router-link :to="`/board/${board.fullId}/${Number(board.issue)+1}?page=1`" type="primary" id="next-issue" :disabled="!nextIssueStatus">下一期 &gt;&gt;</el-router-link>
          </div>
          <div class="flex flex-start gap-4">
            <div>排序方式</div>
            <el-select
              class="w-20!"
              v-model="orderType"
              @change="changeOrder"
            >
              <el-option
                v-for="(value, key) in orderTypes"
                :key="key"
                :value="key"
                :label="value"
              />
            </el-select>
          </div>
        </div>
        <div v-else>
          <SpecialSelector @updateData="handleIssueChanged" />
        </div>
        <h1 v-if="!isSpecial">{{ issueName }}</h1>
        <div v-if="!isSpecial">{{ rankDateString }}</div>
      </div>
      <el-pagination
        background
        hide-on-single-page
        layout="prev, pager, next, jumper"
        :pager-count="5"
        :page-size="20"
        :total="total"
        v-model:current-page="page"
        class="pagination"
        @current-change="handlePageChanged"
      />
      <div v-loading="!board || !ranks || ranks.length == 0" class="min-h-50 w-full grid grid-cols-1 lg:grid-cols-2 gap-4" ref="boardList">
        <RankingCard
          v-for="data in ranks"
          v-if="board && ranks && ranks.length > 0"
          :song="data"
          :board="board"
          :is-today="isToday"
          :section="board.name"
          :key="data.bvid"
        />
      </div>
      <div class="boardpagination">
      <el-pagination
        background
        hide-on-single-page
        layout="prev, pager, next, jumper"
        :pager-count="5"
        :page-size="20"
        :total="total"
        v-model:current-page="page"
        class="pagination"
        @current-change="handlePageChanged"
      />
      </div>
      <CommentFrame class="2xl:hidden"/>
    </div>
    <!-- 开发中内容，只有大屏可见 -->
    <div class="hidden 2xl:block">
      <SuspendPanel class="w-[400px] my-4 p-4">
        <canvas id="qrcode"></canvas>
        <h2 class="big-title">本期看点</h2>
        <h3 class="small-title">统计</h3>
        <h3 class="small-title">火箭</h3>
        <ul>
          <li></li>
        </ul>
        <h3 class="small-title">跳水</h3>
        <div>该部分开发中</div>
      </SuspendPanel>
      <CommentFrame/>
    </div>

  </div>

</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import router from '../router/index.ts'
import Board, { type BoardName, type SequentialBoard } from '../utils/boardv2.ts';
import apiv2 from '@/utils/api/apiv2.ts';
import SpecialSelector from '../components/board/SpecialSelector.vue';
import CommentFrame from '../components/user/CommentFrame.vue';
import { useStatusStore } from '@/store/status.ts';
import RankingCard from '@/components/board/RankingCardV2.vue';
import { ElPagination, ElSelect, ElOption } from 'element-plus';
import ElRouterLink from '@/components/misc/ElRouterLink.vue';
import QRCode from 'qrcode'
import { issueBefore } from '@/utils/datev2.ts';
import { useTitle } from '@vueuse/core';
import SuspendPanel from '@/components/container/SuspendPanel.vue';
import type { Ranking } from '@/utils/RankingData.ts';


const route = useRoute()
const statusStore = useStatusStore()

const orderTypes = {
  'score.total': '总分',
  'offset.view': '播放',
  'offset.favorite': '收藏',
  'offset.coin': '投币',
  'offset.like': '点赞',
}

// 响应式数据
const page = ref(Number(route.query.page) || 1)
const total = ref(0)
const metadata = ref<{
  name: BoardName;
  issue: number;
  part: string
}>();
const orderType = ref<string>('score.total')
const ranks = ref<Ranking[]>([]);
const board = ref<Board>(new Board('vocaloid-daily', 'main', -1))

const lastIssueStatus = ref(false)
const nextIssueStatus = ref(false)

const isSpecial = computed(() => {
  return board.value.name === 'special'
})

const rankDateString = computed(() => board.value.getRankDateString())
const issueName = computed(() => board.value.getBoardName())

const boardList = ref<HTMLElement | null>(null)
const isToday = ref<boolean>(false)

useTitle(computed(() => issueName.value + ' | 术力口数据库'))

// =============== 交互事件 ===============
function changeOrder() {
  console.log(orderType.value)
}


async function handleSearch() {
  ranks.value = []
  let data
  data = await apiv2.getRanking(board.value, page.value, undefined, orderType.value)

  ranks.value = data.data
  metadata.value = data.metadata
  total.value = data.total
  statusStore.articleId = `${board.value.name}-${board.value.issue}`
}

/**
 * 特刊用
 */
async function handleIssueChanged(selected: any) {
  page.value = 1;
  board.value = new Board('vocaloid-special')
  board.value.issue = selected.issue.issue;
  board.value.part = selected.part as string;
  await handleSearch()
}

const handlePageChanged = async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function changeBoard() {
  page.value = 1;
  board.value.part = board.value.part === 'main' ? 'new' : 'main';
  router.push(`/board/${board.value.name}/${board.value.issue}?part=${board.value.part}`)
}

// 监听 page 变化，切换分页时重新获取数据
watch(page, async () => {
  await handleSearch();
}, { immediate: false });

watch(board, async () => {
  if (board.value.name !== 'special'){
    await handleSearch()
    lastIssueStatus.value = await apiv2.checkIssue(board.value);
    nextIssueStatus.value = await apiv2.checkIssue(board.value);
  }
}, {immediate: false})

// =============== 生命周期 ===============

async function init() {
  const params = route.params
  const boardName = params.name as string
  const issue = params.issue as string
  const part = route.query.part as string ?? 'main'

  if (issue !== '') {
    board.value = new Board(boardName, part, Number(issue))
    if (Number(issue) == issueBefore()[boardName as SequentialBoard]) {
      isToday.value = true
    } else {
      isToday.value = false
    }
  } else {
    board.value = new Board(boardName, part, -1)
    isToday.value = true
  }
  QRCode.toCanvas(document.getElementById('qrcode'), window.location.href, function (error) {
    if (error) console.error(error)
  })
}


onMounted(init)
watch(() => route.path, init)
watch(() => route.query.part, init)

</script>


<style lang="scss" scoped>
h1 {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0px;
}

#last-next-issues {

  padding: 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  * {
    font-size: 15px;
    width: auto;
  }
}

.pagination {
  font-size: 14px; // 减小默认字体大小
  margin: 10px 0 10px 0;
}
@media (max-width: 640px) {
  .boardpagination {
    padding: 10px 5px;
  }

  .pagination {
    font-size: 12px;
    :deep(.el-pagination__jump) {
      margin-left: 0;
    }
    :deep(.el-pagination button) {
      min-width: 16px;
    }
    :deep(.el-pager li) {
      min-width: 16px;
    }
  }
}


</style>
