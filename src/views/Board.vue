<template>
  <div class="max-w-full flex flex-row flex-nowrap gap-4 items-start">
    <div class="flex flex-col items-center w-full lg:w-[964px]" >
      <div class="board-header w-full">
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
      </div>
      <div class="w-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RankingCard
          v-for="data in plainData"
          v-bind="data"
          v-if="plainData && plainData.length > 0"
          :key="data.point"
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
      <CommentFrame/>
    </div>
    <!-- 开发中内容，只有大屏可见 -->
    <div class="hidden 2xl:block bg-cyan-200 w-[400px] my-4 p-4">
      <h2 class="big-title">本期看点</h2>
      <h3 class="small-title">统计</h3>
      <h3 class="small-title">火箭</h3>
      <ul>
        <li></li>
      </ul>
      <h3 class="small-title">跳水</h3>
      <div>该部分开发中</div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import router from '../router/index.ts'
import { boardToPlain } from '../utils/dataConverter.ts'
import Board from '../utils/board.ts';
import { requester } from '../utils/api/requester.ts'
import SpecialSelector from '../components/board/SpecialSelector.vue';
import CommentFrame from '../components/user/CommentFrame.vue';
import { useStatusStore } from '@/store/status.ts';
import RankingCard from '@/components/board/RankingCard.vue';
const route = useRoute()
const statusStore = useStatusStore()

// 响应式数据
const page = ref(Number(route.query.page) || 1)
const total = ref(1000)
const rawData = ref<Record<string, any>>();
const board = ref<Board>(new Board('vocaloid-daily-main', -1))

const lastIssueStatus = ref(false)
const nextIssueStatus = ref(false)

// 计算属性
const plainData = computed(() => {
  try {
    if (rawData.value) {
      return rawData.value.board.map((item: any) => boardToPlain(item, board.value, rawData.value?.metadata));
    }
    return [];
  } catch (error) {
    console.log(error)
    return [];
  }
});

const isSpecial = computed(() => {
  return board.value.section === 'special'
})

const rankDateString = computed(() => board.value.getRankDateString())
const issueName = computed(() => board.value.getBoardName())

// 方法
async function handleSearch() {
  let data
  if (board.value.issue === -1){
    data = await requester.get_board(board.value, undefined, page.value)
  } else {
    data = await requester.get_board(board.value, undefined, page.value)
  }
  rawData.value = data;
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

async function init() {
  const params = route.params
  const boardId = params.boardId as string
  const issue = params.issue as string
  if (issue !== '') {
    board.value = new Board(boardId, Number(issue))
  } else {
    board.value = new Board(boardId, -1)
  }
}

// 注册事件
onMounted(init)
watch(() => route.path, init)

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
</script>


<style lang="scss" scoped>
h1 {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0px;
}
.board-header {
  padding: 0px 0px;
  margin: 0px 0px 20px 0px;
  text-align: center;
  background: rgba(255, 255, 255, 0.8);
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
  .boardpagination {
  display: flex;
  justify-content: center;
  padding: 15px 10px;
}

 .pagination {
  max-width: 100%;
  font-size: 14px; // 减小默认字体大小
}
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
