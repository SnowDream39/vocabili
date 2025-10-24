<template>
  <div class="form">
    <div class="form-row">
      <span>投稿</span>
      <el-select v-model="model.copyright" >
        <el-option v-for="copyright in copyrights" :value="copyright.value" :label="copyright.label" />
      </el-select>
      <span>规则</span>
      <el-select v-model="model.board.id" placeholder="类型">
        <el-option v-for="board in boards" :value="board.value" :label="board.label" />
      </el-select>
      <el-input v-model="model.board.issue"/>
    </div>
  </div>
  <div class="my-5"></div>
  <div id="calculator-1">
    <div>播放</div>
    <el-input type="number" v-model.number="model.view" class="w-30!"></el-input>
    <div>×{{ results.ratios.view.toFixed(2) }}</div>
    <div>{{ results.points.view.toLocaleString() }}</div>
    <div>收藏</div>
    <el-input type="number" v-model.number="model.favorite" class="w-30!"></el-input>
    <div>×{{ results.ratios.favorite.toFixed(2) }}</div>
    <div>{{ results.points.favorite.toLocaleString() }}</div>
    <div>硬币</div>
    <div class="flex flex-row items-end">
      <el-input type="number" v-model.number="model.coin" class="w-30!"></el-input>
      <span class="text-xs"> ×{{ results.fixes.a.toFixed(2) }}</span>
    </div>
    <div>×{{ results.ratios.coin.toFixed(2) }}</div>
    <div>{{ results.points.coin.toLocaleString() }}</div>
    <div>点赞</div>
    <el-input type="number" v-model.number="model.like" class="w-30!"></el-input>
    <div>×{{ results.ratios.like.toFixed(2) }}</div>
    <div>{{ results.points.like.toLocaleString() }}</div>
  </div>
  <hr/>
  <div class="flex justify-end">
    <div v-if="false" class="w-1/2 center-container">
    </div>
    <CalcChart class="w-1/2" :data="results.points" />
    <div class="w-1/2">
      <div class="grid grid-cols-2 gap-2">
        <div>基础分</div>
        <div>{{ results.points.basis.toLocaleString() }}</div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>小电视补正</div>
        <div>×{{ results.fixes.b.toFixed(2) }}</div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>梗曲补正</div>
        <div>×{{ results.fixes.c.toFixed(2) }}</div>
      </div>
      <hr/>
      <div class="grid grid-cols-2 gap-2">
        <div>总分</div>
        <div>{{ results.points.total.toLocaleString() }}</div>
      </div>
    </div>
  </div>

  <a :href="`/calculator?view=${model.view}&favorite=${model.favorite}&coin=${model.coin}&like=${model.like}&copyright=${model.copyright}&boardId=${model.board.id}&issue=${model.board.issue}`">
    <button class="btn-primary">打开计算器页</button>
  </a>

</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { Calculator } from '@/utils/calculator'
import Board from '@/utils/board';
import { ElSelect, ElInput, ElOption } from 'element-plus';
import CalcChart from '../CalcChart.vue';

export interface Form {
  view: number
  favorite: number
  coin: number
  like: number
  copyright: number
  board: Board
  [key: string]: any
}

const model = defineModel<Form>({
  required: true
})

const emit = defineEmits(['send-points'])

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
  const { view, favorite, coin, like, copyright } = model.value
  const count = { view, favorite, coin, like, copyright }
  const calc = new Calculator(count, copyright, model.value.board)
  return calc.getResults()
})

watch(() => results.value, (value) => {
  console.log(value)
  emit('send-points', value.points)
}, {immediate: true})
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
