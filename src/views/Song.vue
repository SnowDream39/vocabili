<template>
  <div class="w-full m-4 flex flex-nowrap flex-col justify-center items-center xl:flex-row xl:items-start">
    <!-- 歌曲信息 -->
    <div class="w-full max-w-[600px] mx-10 xl:w-auto xl-basis-lg xl:grow-1 flex flex-col flex-nowrap items-center gap-4" >
      <SongInfo v-if="songInfo" v-bind="songInfo" class="w-full" />
      <CommentFrame class="hidden xl:block" />
    </div>

    <!-- 排行数据 -->
    <div class="board-data max-w-full">
      <h3 class="board-title">日刊数据</h3>
      <SongHistoryTable :songId="songId" boardId="vocaloid-daily" class="board-table" />

      <h3 class="board-title">周刊数据</h3>
      <SongHistoryTable :songId="songId" boardId="vocaloid-weekly" class="board-table" />

      <h3 class="board-title">月刊数据</h3>
      <SongHistoryTable :songId="songId" boardId="vocaloid-monthly" class="board-table" />
    </div>
  </div>
  <CommentFrame class="xl:hidden" />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { requester } from '../utils/api/requester';
import { onMounted, ref } from 'vue';
import { useStatusStore } from '@/store/status';
import SongHistoryTable from '@/components/song/SongHistoryTable.vue';
import CommentFrame from '@/components/user/CommentFrame.vue';
import SongInfo from '@/components/song/SongInfo.vue';

const statusStore = useStatusStore()

const songInfo = ref<any>()
const songId = ref<string>();


async function fetchSongInfo(songId: string) {
  console.log(songId)
  try {
    const data = await requester.get_song_info(songId);
    return data[0];
  } catch (error) {
    console.log('获取数据失败：', error);
    return null;
  }
}

onMounted(async () => {
  const route = useRoute(); // 在生命周期钩子中调用 useRoute
  songId.value = route.params.id as string ; // 更新 songId
  songInfo.value = await fetchSongInfo(songId.value);
  statusStore.articleId = songId.value;
})
</script>


<style lang="scss" scoped>
/* 保证页面没有横向滚动条 */
html,
body {
  margin: 0px;
  padding: 0px;
  overflow-x: hidden;
  /* 禁止水平滚动 */
  width: 100%;
  height: 100%;
}

a {
  text-decoration: none;
}


.board-data {
  display: flex;
  flex-direction: column;
  gap: 20px;
  /* 增加板块之间的间距 */
}

.board-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.board-table {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  width: 100%;
  /* 确保表格自适应 */
}

/* 表格优化：禁止表格产生水平滚动 */
.el-table {
  margin: 0;
  padding: 0;
  border: none;
  width: 100%;
  /* 保证表格宽度始终自适应 */
}

.el-table-column {
  padding: 12px;
}

/* 小屏幕适配 */
@media (max-width: 768px) {
  .song-info-container {
    padding: 10px;
    margin-left: 50px;
    margin-right: 50px;
    /* 小屏幕时减少内边距 */
  }

  .board-title {
    font-size: 20px;
    /* 小屏幕时调整标题字体大小 */
  }

  .board-table {
    padding: 8px;
    /* 小屏幕时调整表格内边距 */
  }

  .el-table-column {
    padding: 10px;
    /* 小屏幕时调整表格列的内边距 */
  }
}

/* 超小屏幕适配（如手机） */
@media (max-width: 480px) {
  .song-info-container {
    padding: 10px;
    /* 手机屏幕时进一步减小内边距 */
  }

  .board-title {
    font-size: 18px;
    /* 手机屏幕时调整标题字体大小 */
  }

  .board-table {
    padding: 5px;
    /* 手机屏幕时减少表格内边距 */
  }

  .el-table-column {
    padding: 8px;
    /* 手机屏幕时调整表格列的内边距 */
  }
}
</style>
