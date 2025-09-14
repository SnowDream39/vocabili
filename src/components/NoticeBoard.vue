<template>
  <div class="w-80 bg-zinc-50 h-auto p-3">
    <div class="text-xl">欢迎来到术力口数据库！你可以在这里探索最新的bilibili术力口数据。</div>
    <h2 class="small-title">公告</h2>
    <div v-if="announcementData" v-for="data in announcementData.reverse()" class="my-2 border-1 border-black rounded-md p-2 *:my-1">
      <div class="font-bold">{{ data.title }}</div>
      <div>{{ data.content }}</div>
      <div class="text-gray-500">{{ data.date }}</div>
    </div>
    <div>
      <a class="*:text-lg" href="https://www.wjx.top/vm/Q0elCBQ.aspx">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg shadow-blue-500/50 my-2">
          点击提交网站反馈
        </button>
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const announcementData = ref<any>(null);

onMounted(async () => {
  announcementData.value = await axios.get('/announcements.json').then(res => res.data)
})

</script>
