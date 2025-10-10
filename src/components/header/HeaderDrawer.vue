<template>
  <header class="w-full text-onSurface">
    <nav class="fixed bg-surfaceContainer z-100 w-full h-[50px] flex justify-between items-center text-2xl *:mx-2 *:cursor-pointer">
      <div @click="logoClicked" class="i-eva-menu-outline"></div>
      <div @click="router.push('/')" class="flex h-full items-center">
        <img src="/vocabili.png" class="h-4/5" />
        <span class="p-2">术力口数据库</span>
      </div>
      <div @click="router.push('/search')" class="i-eva-search-outline"></div>
    </nav>
  </header>
  <el-drawer
    direction="ltr"
    v-model="asideVisible"
    :with-header="false"
    style="background: rgba(255,255,255,0.2);backdrop-filter: blur(12px);"
  >
    <el-menu
      :default-active="activeIndex"
      mode="vertical"
      :ellipsis="false"
      :router="true"
      @select="handleSelect"
    >
      <el-sub-menu index="3">
        <template #title>
          <div class="i-material-symbols-account-circle-full"></div>
        </template>
        <el-menu-item index="/user">用户</el-menu-item>
        <el-menu-item index="/settings">设置</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="1">
        <template #title>排行</template>
        <el-menu-item index="/board/vocaloid-daily-main">日刊</el-menu-item>
        <el-menu-item index="/board/vocaloid-weekly-main">周刊</el-menu-item>
        <el-menu-item index="/board/vocaloid-monthly-main">月刊</el-menu-item>
        <el-menu-item index="/board/vocaloid-special">特刊</el-menu-item>
        <el-menu-item index="/top5">前五</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>统计</template>
        <el-menu-item index="/pool">总数据</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="/work">打标</el-menu-item>
      <el-menu-item index="/about">关于</el-menu-item>
      <el-menu-item index="/search">搜索</el-menu-item>
    </el-menu>
  </el-drawer>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import router from '../../router/index.ts'

const asideVisible = ref(false)

function logoClicked() {
  asideVisible.value = !asideVisible.value
}

const activeIndex = ref('1')
const handleSelect = () => {
  asideVisible.value = false
}

</script>

<style lang="scss" scoped>

.el-menu {
  height: 100%;
  --el-menu-item-font-size: 18px;
  --el-menu-base-level-padding: 10px;
}



nav li:not(#logoheader) {
  display: none;
}

#logoheader {
  height: 80%;
  display: block;
  align-items: enter;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
  /* 使用现代无衬线字体 */
  font-size: 25px;
  font-weight: bold;
  padding: 10px 10px;
  /* 内边距 */
  transform: translateX(20px);

  img {
    height: 100%;
  }
}

#menu-button {
  font-size: 24px;
  margin-left: 5px;
  /* 安全边距 */
  order: -1;
  /* 强制最左侧 */
  transform: translateX(-1px);
  /* 微调对齐 */
  margin: 10px;
}


</style>
