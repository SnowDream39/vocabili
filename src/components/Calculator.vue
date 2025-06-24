<template>
  <div class="form">
    <div class="form-row">
      <span>播放</span><el-input v-model.number="form.view" />
      <span>收藏</span><el-input v-model.number="form.favorite" />
    </div>
    <div class="form-row">
      <span>硬币</span><el-input v-model.number="form.coin" />
      <span>点赞</span><el-input v-model.number="form.like" />
    </div>
    <div class="form-row">
      <span>投稿</span>
      <el-select v-model="form.copyright">
        <el-option v-for="copyright in copyrights" :value="copyright.value" :label="copyright.label" />
      </el-select>
      <span>规则</span>
      <el-select v-model="form.board.id" placeholder="类型">
        <el-option v-for="board in boards" :value="board.value" :label="board.label" />
      </el-select>
      <el-input v-model="form.board.issue" />
    </div>
  </div>

  <div id="calculator-show">
    <div>播放：{{ results.counts.view }}</div>
    <div>播放修正：{{ results.ratios.view.toFixed(2) }}</div>
    <div>播放分：{{ results.points.view }}</div>
    <div>fixA：{{ results.fixes.a.toFixed(2) }}</div>
    <div>收藏：{{ results.counts.favorite }}</div>
    <div>收藏修正：{{ results.ratios.favorite.toFixed(2) }}</div>
    <div>收藏分：{{ results.points.favorite }}</div>
    <div>fixB：{{ results.fixes.b.toFixed(2) }}</div>
    <div>硬币：{{ results.counts.coin }}</div>
    <div>硬币修正：{{ results.ratios.coin.toFixed(2) }}</div>
    <div>硬币分：{{ results.points.coin }}</div>
    <div>fixC：{{ results.fixes.c.toFixed(2) }}</div>
    <div>点赞：{{ results.counts.like }}</div>
    <div>点赞修正：{{ results.ratios.like.toFixed(2) }}</div>
    <div>点赞分：{{ results.points.like }}</div>
    <div>总分：{{ results.points.total }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { Calculator } from '../utils/calculator'
import Board from '../utils/board';

export interface Form {
  view: number
  favorite: number
  coin: number
  like: number
  copyright: number
  board: Board
}

const props = defineProps<Form>()

const form = ref<Form>({
  view: 1,
  favorite: 1,
  coin: 1,
  like: 1,
  copyright: 1,
  board: new Board('vocaloid-daily-main', 1),
})

const boards = ref([
  { value: 'vocaloid-daily', label: '日刊' },
  { value: 'vocaloid-weekly', label: '周刊' },
  { value: 'vocaloid-monthly', label: '月刊' },
])

const copyrights = ref([
  { value: 1, label: '原创' },
  { value: 2, label: '搬运' },
])

const results = computed(() => {
  const { view, favorite, coin, like, copyright } = form.value
  const count = { view, favorite, coin, like, copyright }
  const calc = new Calculator(count, copyright, form.value.board)
  return calc.getResults()
})

async function init() {
  const { view, favorite, coin, like, copyright, board } = props
  form.value = { view, favorite, coin, like, copyright, board }
}

onMounted(init)

</script>

<style lang="scss" scoped>
.form {

  .form-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;


    span {
      display: inline-block;
      white-space: nowrap;
    }
  }

}

.el-input {
  display: inline;
}



#calculator-show {
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);

  div {
    box-sizing: border-box;
    padding: 5px 5px;
  }
}
</style>
