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
      <div v-loading="!metadata || !boards || boards.length == 0" class="min-h-50 w-full grid grid-cols-1 lg:grid-cols-2 gap-4" ref="boardList">
        <RankingCard
          v-for="data in boards"
          v-if="metadata && boards && boards.length > 0"
          class="grid"
          :board="data"
          :metadata="metadata"
          :is-today="isToday"
          :section="board.section"
          :key="data.target.metadata.id"
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
import Board, { type BasicSection } from '../utils/board.ts';
import { requester } from '../utils/api/requester.ts'
import SpecialSelector from '../components/board/SpecialSelector.vue';
import CommentFrame from '../components/user/CommentFrame.vue';
import { useStatusStore } from '@/store/status.ts';
import RankingCard from '@/components/board/RankingCard.vue';
import { ElPagination, ElSelect, ElOption } from 'element-plus';
import ElRouterLink from '@/components/misc/ElRouterLink.vue';
import type { DataMetadata, Board as DataBoard } from '@/utils/boardData.ts';
import QRCode from 'qrcode'
import { issueBefore } from '@/utils/date.ts';
import { useTitle } from '@vueuse/core';


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
const metadata = ref<DataMetadata>();
const orderType = ref<string>('score.total')
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
const isToday = ref<boolean>(false)

useTitle(computed(() => issueName.value + ' | 术力口数据库'))

// =============== 交互事件 ===============
function changeOrder() {
  console.log(orderType.value)
}


async function handleSearch() {
  boards.value = []
  let data
  if (board.value.issue === -1){
    data = await requester.get_board(board.value, undefined, page.value, orderType.value)
  } else {
    data = await requester.get_board(board.value, undefined, page.value, orderType.value)
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

// =============== 生命周期 ===============

async function init() {
  const params = route.params
  const boardId = params.boardId as string
  const issue = params.issue as string
  if (issue !== '') {
    board.value = new Board(boardId, Number(issue))
    console.log(issueBefore()[boardId.split('-')[1] as BasicSection])
    if (Number(issue) == issueBefore()[boardId.split('-')[1] as BasicSection]) {
      isToday.value = true
    } else {
      isToday.value = false
    }
  } else {
    board.value = new Board(boardId, -1)
    isToday.value = true
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
