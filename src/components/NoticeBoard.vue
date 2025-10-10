<template>
  <div class="w-80 h-auto p-3">
    <div class="text-xl">欢迎来到术力口数据库！你可以在这里探索最新的bilibili术力口数据。</div>
    <h2 class="small-title">公告</h2>
    <div v-if="announcementData" class="my-2 border-1 border-black rounded-md p-2 *:my-1">
      <div>{{ announcementData.content }}</div>
      <div class="text-gray-500">{{ announcementData.date }}</div>
    </div>
    <div>
      <a class="*:text-lg" href="https://www.wjx.top/vm/Q0elCBQ.aspx">
        <button class="btn-primary font-bold py-2 px-4 rounded shadow-lg my-2">
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
