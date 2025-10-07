<template>
  <header class="w-full text-onSurface bg-[var(--md-sys-color-surface-container)]">
    <nav class="w-full h-[50px] flex justify-between items-center text-2xl *:px-2">
      <span @click="logoClicked">
        ☰
      </span>
      <div @click="router.push('/')" class="flex h-full">
        <img src="/vocabili.png" class="h-full" />
        <span class="p-2">术力口数据库</span>
      </div>
      <span @click="router.push('/search')">
        🔍
      </span>
    </nav>
  </header>
    <el-drawer direction="ltr" v-model="asideVisible" :with-header="false" style="background: rgba(255,255,255,0.2);backdrop-filter: blur(12px);">
      <aside>
        <ul>
          <li @click="jump('/user')">用户</li>
          <li @click="jump('/board/vocaloid-daily-main/')">日刊</li>
          <li @click="jump('/board/vocaloid-weekly-main/')">周刊</li>
          <li @click="jump('/board/vocaloid-monthly-main/')">月刊</li>
          <li @click="jump('/board/vocaloid-special')">特刊</li>
          <li @click="jump('/pool')">统计</li>
          <li @click="jump('/top5')">前五</li>
          <li @click="jump('/work')">打标</li>
          <li @click="jump('/about')">关于</li>
        </ul>
      </aside>
    </el-drawer>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import router from '../../router/index.ts'

const asideVisible = ref(false)

function logoClicked() {
  asideVisible.value = !asideVisible.value
}

function jump(address: string) {
  router.push(address)
  asideVisible.value = false
}

</script>

<style lang="scss" scoped>




aside ul {
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  list-style: none;
  font-size: 18px;


  li {
    padding: 10px 10px;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease; /* 添加平滑过渡 */
  }

  li:hover {
    background-color: #b9b9b9; /* 悬停时背景色变化 */
    transform: scale(1.03);
  }

  li a {
    text-decoration: none;
  }
}
#search-vpoll {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 15px 15px; // 保持与其他导航项一致的内边距

  .el-icon {
    font-size: 18px;
  }
}



nav li:not(#logoheader) {
  display: none;
}

#logoheader {
  height: 100%;
  display: block;
  align-items: center;
  margin: 0 auto;
  font-family: 'Arial', sans-serif; /* 使用现代无衬线字体 */
  font-size: 25px;
  font-weight: bold;
  padding: 10px 10px; /* 内边距 */
  transform: translateX(20px);

  img {
    height: 100%;
  }
}

#menu-button {
  font-size: 24px;
  margin-left: 5px; /* 安全边距 */
  order: -1; /* 强制最左侧 */
  transform: translateX(-1px); /* 微调对齐 */
  margin: 10px;
}

#search-mobile {
  margin-left: 5px; /* 安全边距 */
  order: 1; /* 强制最左侧 */
  transform: translateX(-5px); /* 微调对齐 */
}


</style>
