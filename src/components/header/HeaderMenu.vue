<template>
  <el-menu
    :default-active="activeIndex"
    mode="horizontal"
    :ellipsis="false"
    :router="true"
    @select="handleSelect"
    class="fixed z-9999"
  >
    <el-menu-item index="/">
      <span @click="router.push('/')" class="flex items-center gap-4 text-2xl text-onSurface">
        <img style="width: 40px" src="/vocabili.png" alt="Vocabili Logo"/>
        <span>术力口数据库</span>
      </span>
    </el-menu-item>
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
    <el-menu-item index="/search">
      <div class="i-eva-search-outline"></div>
    </el-menu-item>
    <el-sub-menu  index="3">
      <template #title>
        <div class="i-material-symbols-account-circle-full"></div>
      </template>
      <el-menu-item index="/user">用户</el-menu-item>
      <el-menu-item index="/settings">设置</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import router from '../../router'

const activeIndex = ref('1')
const handleSelect = () => {

}


</script>

<style scoped>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}

.el-menu--horizontal {
  --el-menu-horizontal-height: 50px;
}

.el-menu {
  width: 100%;
  --el-menu-item-font-size: 18px;
  --el-menu-base-level-padding: 10px;
}

</style>
