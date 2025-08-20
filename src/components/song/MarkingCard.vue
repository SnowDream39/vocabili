<template>
  <div class="marking-card w-full my-2 flex flex-col sm:flex-row">
    <div name="left" class=" mx-2" :title="record.title" >
      <img :src="record.image_url" alt="thumbnail" class="w-[200px]" @click="jumpToVideo(record.bvid)" />
      <el-switch v-model="includeEntries[index]" class="mb-2" />
    </div>
    <div name="right" class="grow-1" >
      <div class="grid grid-cols-1 grid-rows-6 lg:grid-cols-2 lg:grid-rows-3">
        <div v-for="field in fields" class="flex flex-row w-full">
          <span class="w-15">{{ field.label }}</span>
          <el-input
            v-if="field.type === 'string'"
            v-model="record[field.prop]"
            style="height: 30px"
          ></el-input>
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
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElInput, ElSelect, ElSwitch } from 'element-plus';

const fields = [
  { type:'string', label: '歌名', prop: 'name' },
  { type:'string', label: '歌手', prop: 'vocal' },
  { type:'string', label: '作者', prop: 'author' },
  { type:'string', label: '引擎', prop: 'synthesizer' },
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
];

defineProps<{
  record: any;
  includeEntries: any[]
  index: number;
}>();

function jumpToVideo(bvid: string) {
  console.log(bvid);
  window.open(`https://www.bilibili.com/video/${bvid}`, '_blank');
}

</script>
