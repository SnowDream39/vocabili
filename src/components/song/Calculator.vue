<template>
  <div class="form">
    <div class="form-row">
      <span>投稿</span>
      <el-select v-model="form.copyright" >
        <el-option v-for="copyright in copyrights" :value="copyright.value" :label="copyright.label" />
      </el-select>
      <span>规则</span>
      <el-select v-model="form.board.id" placeholder="类型">
        <el-option v-for="board in boards" :value="board.value" :label="board.label" />
      </el-select>
      <el-input v-model="form.board.issue"/>
    </div>
  </div>
  <div class="my-5"></div>
  <div id="calculator-1">
    <div>播放</div>
    <el-input v-model="results.counts.view" class="w-30!"></el-input>
    <div>×{{ results.ratios.view.toFixed(2) }}</div>
    <div>{{ results.points.view }}</div>
    <div>收藏</div>
    <el-input v-model="results.counts.favorite" class="w-30!"></el-input>
    <div>×{{ results.ratios.favorite.toFixed(2) }}</div>
    <div>{{ results.points.favorite }}</div>
    <div>硬币</div>
    <div class="flex flex-row items-end">
      <el-input v-model="results.counts.coin" class="w-30!"></el-input>
      <span class="text-xs"> ×{{ results.fixes.a.toFixed(2) }}</span>
    </div>
    <div>×{{ results.ratios.coin.toFixed(2) }}</div>
    <div>{{ results.points.coin }}</div>
    <div>点赞</div>
    <el-input v-model="results.counts.like" class="w-30!"></el-input>
    <div>×{{ results.ratios.like.toFixed(2) }}</div>
    <div>{{ results.points.like }}</div>
  </div>
  <hr/>
  <div>
    <div class="grid grid-cols-4 gap-2">
      <div></div>
      <div></div>
      <div>基础分</div>
      <div>{{ results.points.basis }}</div>
    </div>
    <div class="grid grid-cols-4 gap-2">
      <div></div>
      <div></div>
      <div>高播放补正</div>
      <div>×{{ results.fixes.b.toFixed(2) }}</div>
    </div>
    <div class="grid grid-cols-4 gap-2">
      <div></div>
      <div></div>
      <div>小电视补正</div>
      <div>×{{ results.fixes.c.toFixed(2) }}</div>
    </div>
  </div>
  <hr/>
  <div class="grid grid-cols-4 gap-2">
    <div></div>
    <div></div>
    <div>总分</div>
    <div>{{ results.points.total }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { Calculator } from '@/utils/calculator'
import Board from '@/utils/board';
import { ElSelect, ElInput, ElOption } from 'element-plus';

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
  board: new Board('vocaloid-daily-main'),
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

  width: auto;

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



#calculator-1 {
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: 1fr 3fr 2fr 2fr;
  grid-template-rows: repeat(4, 1fr);
}


</style>
