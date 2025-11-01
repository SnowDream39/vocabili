<template>
  <div class="marking-card max-w-150 suspend-panel w-full p-4">
    <div class="flex flex-col sm:flex-row">
      <div name="left" class=" mx-2" :title="record.title" >
        <a :href="`https://www.bilibili.com/video/${record.bvid}`" target="_blank">
          <img :src="record.image_url" alt="thumbnail" class="w-[200px]" referrerpolicy="no-referrer" />
        </a>
        <el-switch v-model="includeEntries[index]" class="mb-2" />
      </div>
      <div name="right" class="grow" >
        <div class="text-lg font-bold">{{ record.title }}</div>
        <div class="grid grid-cols-1 grid-rows-[repeat(8,auto)] lg:grid-cols-2 lg:grid-rows-[repeat(4,auto)]">
          <div v-for="field in fields" class="flex flex-row w-full">
            <span class="w-15">{{ field.label }}</span>
            <el-input
              v-if="field.type === 'string'"
              v-model="record[field.prop]"
              style="height: 30px"
            ></el-input>
            <MarkingTags
              v-if="['tags', 'tags-hint'].includes(field.type)"
              :type="field.search ?? field.prop"
              :use-hint="field.type == 'tags-hint'"
              v-model="record[field.prop]"
            ></MarkingTags>
            <el-select
              v-if="field.type === 'select'"
              v-model="record[field.prop]"
              style="height: 30px"
            >
              <el-option
                v-for="item of field.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>时长：{{ record.duration }}</div>
          <div>分P：{{ record.page }}</div>
        </div>
      </div>
    </div>
    <div v-if="props.svmode">
      <div class="max-h-12 overflow-hidden">{{ record.intro }}</div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ElInput, ElSelect, ElSwitch, ElOption } from 'element-plus';
import MarkingTags from '@/components/song/MarkingTags.vue';

const props = defineProps<{
  record: any
  includeEntries: any[]
  index: number
  svmode: boolean
}>();

const fields = props.svmode ? [
  { type:'tags', label: '榜单', prop: 'synthesizer', },
  { type:'select', label: '版权', prop: 'copyright', options: [
    {value:1, label: '自制'},
    {value:2, label:'转载'},
    {value:3, label: '转载投自制'},
    {value:4, label: '自制投转载'},
  ]},
] : [
  { type:'string', label: '歌名', prop: 'name' },
  { type:'tags-hint', label: '歌手', prop: 'vocal', search: 'vocalist' },
  { type:'tags-hint', label: '作者', prop: 'author', search: 'producer' },
  { type:'tags-hint', label: '引擎', prop: 'synthesizer', search: 'synthesizer' },
  { type:'select', label: '版权', prop: 'copyright', options: [
    {value:1, label: '自制'},
    {value:2, label:'转载'},
    {value:3, label: '转载投自制'},
    {value:4, label: '自制投转载'},
  ]},
  { type:'select', label: '类别', prop: 'type', options: [
    {value:'翻唱', label: '翻唱'},
    {value:'原创', label: '原创'},
    {value:'串烧', label:'串烧'},
    {value: '本家重置', label: '本家重置'},
  ]},
]





</script>
