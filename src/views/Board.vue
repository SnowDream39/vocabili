<template>
  <div class="max-w-full flex flex-row flex-nowrap gap-4 items-start">
    <div class="flex flex-col items-center w-full lg:w-[964px]" >
      <div class="w-full text-center mb-4">
        <div id="last-next-issues" v-if="!isSpecial">
          <el-link type="primary" :href="`/board/${board.fullId}/${board.issue-1}?page=1`" id="last-issue" :disabled="!lastIssueStatus">&lt;&lt;上一期</el-link>
          <el-link type="info" @click="changeBoard" id="change-board">切换总榜/新曲榜</el-link>
          <el-link type="primary" :href="`/board/${board.fullId}/${Number(board.issue)+1}?page=1`" id="next-issue" :disabled="!nextIssueStatus">下一期 &gt;&gt;</el-link>
        </div>
        <div v-else>
          <SpecialSelector @updateData="handleIssueChanged" />
        </div>
        <h1 v-if="!isSpecial">{{ issueName }}</h1>
        <div v-if="!isSpecial">{{ rankDateString }}</div>
        <el-button @click="toggleBoardStyle" class="float-right sm:hidden!" type="primary">切换外观</el-button>
      </div>
      <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-4" ref="boardList">
        <RankingCard
          v-for="data in boards"
          v-if="metadata && boards && boards.length > 0"
          class="hidden sm:grid"
          :board="data"
          :metadata="metadata"
          :key="data.target.metadata.id"
        />
        <RankingCardMobile
          v-for="data in boards"
          v-if="metadata && boards && boards.length > 0"
          class="grid sm:hidden"
          :board="data"
          :metadata="metadata"
          :key="data.target.metadata.id"
        />
      </div>
      <div class="boardpagination">
      <el-pagination
        background
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
      <div class="suspend-panel w-[400px] my-4 p-4">
        <canvas id="qrcode"></canvas>
        <h2 class="big-title">本期看点</h2>
        <h3 class="small-title">统计</h3>
        <h3 class="small-title">火箭</h3>
        <ul>
          <li></li>
        </ul>
        <h3 class="small-title">跳水</h3>
        <div>该部分开发中</div>
      </div>
      <CommentFrame/>
    </div>

  </div>

</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import router from '../router/index.ts'
import Board from '../utils/board.ts';
import { requester } from '../utils/api/requester.ts'
import SpecialSelector from '../components/board/SpecialSelector.vue';
import CommentFrame from '../components/user/CommentFrame.vue';
import { useStatusStore } from '@/store/status.ts';
import RankingCard from '@/components/board/RankingCard.vue';
import RankingCardMobile from '@/components/board/RankingCardMobile.vue';
import { ElPagination, ElButton } from 'element-plus';
import type { DataMetadata, Board as DataBoard } from '@/utils/boardData.ts';
import QRCode from 'qrcode'
const route = useRoute()
const statusStore = useStatusStore()

// 响应式数据
const page = ref(Number(route.query.page) || 1)
const total = ref(1000)
const metadata = ref<DataMetadata>();
const boards = ref<DataBoard[]>([]);
const board = ref<Board>(new Board('vocaloid-daily-main', -1))

const lastIssueStatus = ref(false)
const nextIssueStatus = ref(false)

const isSpecial = computed(() => {
  return board.value.section === 'special'
})

const rankDateString = computed(() => board.value.getRankDateString())
const issueName = computed(() => board.value.getBoardName())

const boardList = ref<HTMLElement | null>(null)
// =============== 交互事件 ===============
async function handleSearch() {
  boards.value = []
  let data
  if (board.value.issue === -1){
    data = await requester.get_board(board.value, undefined, page.value)
  } else {
    data = await requester.get_board(board.value, undefined, page.value)
  }
  boards.value = data.board
  metadata.value = data.metadata
  total.value = data.metadata.count
  board.value.issue = data.metadata.issue
  statusStore.articleId = `${board.value.id}-${board.value.issue}`
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
  router.push(`/board/${board.value.fullId}/${board.value.issue}`)
}

// 监听 page 变化，切换分页时重新获取数据
watch(page, async () => {
  await handleSearch();
}, { immediate: false });

watch(board, async () => {
  if (board.value.section !== 'special'){
    await handleSearch()
    lastIssueStatus.value = await requester.check_issue(board.value.id, board.value.issue - 1);
    nextIssueStatus.value = await requester.check_issue(board.value.id, Number(board.value.issue) + 1);
  }
}, {immediate: false})

function toggleBoardStyle() {
  if (boardList.value) {
    boardList.value.classList.toggle('mini')
  }
}

// =============== 生命周期 ===============

async function init() {
  const params = route.params
  const boardId = params.boardId as string
  const issue = params.issue as string
  if (issue !== '') {
    board.value = new Board(boardId, Number(issue))
  } else {
    board.value = new Board(boardId, -1)
  }
  QRCode.toCanvas(document.getElementById('qrcode'), window.location.href, function (error) {
    if (error) console.error(error)
  })
}


onMounted(init)
watch(() => route.path, init)

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
    color: #8a8a8a;
    width: auto;
  }

 .pagination {
    max-width: 100%;
    font-size: 14px; // 减小默认字体大小
  }
}
.mini {
  width: 90%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;

  :deep(.ranking-card) {
    width: 45%;
    aspect-ratio: 2 / 1;
  }
  :deep([name="right"]) {
    display: none;
  }
  :deep(.current-rank) {
    font-size: 250%;
  }
  :deep(.vocal-colors) {
    display: none;
  }
}
.boardpagination {
  display: flex;
  justify-content: center;
  padding: 15px 10px;
  z-index: 100;
}
@media (max-width: 630px) {
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
