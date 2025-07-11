<template>
  <div class="song-info-container">
    <!-- 歌曲信息 -->
    <SongInfo v-if="songInfo" v-bind="songInfo" class="song-info" />

    <!-- 排行数据 -->
    <div class="board-data">
      <h3 class="board-title">日刊数据</h3>
      <SongHistoryTable :songId="songId" boardId="vocaloid-daily" class="board-table" />

      <h3 class="board-title">周刊数据</h3>
      <SongHistoryTable :songId="songId" boardId="vocaloid-weekly" class="board-table" />

      <h3 class="board-title">月刊数据</h3>
      <SongHistoryTable :songId="songId" boardId="vocaloid-monthly" class="board-table" />
    </div>
  </div>
  <CommentFrame />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { requester } from '../utils/api/requester';
import { onMounted, ref } from 'vue';
import { useStatusStore } from '@/store/status';
import SongHistoryTable from '@/components/song/SongHistoryTable.vue';
import CommentFrame from '@/components/user/CommentFrame.vue';

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

.song-info-container {
  padding: 20px;
  background-color: #f9f9f9;
  /* 背景色 */
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;

  max-width: 1200px;
  margin: 0 auto;
  /* 居中 */
  overflow-x: hidden;
  /* 禁止横向滚动 */
}

.song-info {
  margin-bottom: 30px;
  /* 歌曲信息与排行数据之间的间距 */
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
