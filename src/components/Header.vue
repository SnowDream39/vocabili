<template>
  <header>
    <nav>
      <span @click="router.push('/')" id="logoheader"><img src="/vocabili.png" /><span>术力口数据库</span></span>
      <span @click="logoClicked" id="menu-button">
        ☰
      </span>
      <span @click="router.push('/search')" id="search-mobile">
        🔍
      </span>

      <ul>
        <li @click="router.push('/search')" id="search-vpoll">
          <el-icon>
            <component :is="Search" />
          </el-icon>
        </li>
        <li @click="router.push('/board/vocaloid-daily-main/')">日刊</li>
        <li @click="router.push('/board/vocaloid-weekly-main/')">周刊</li>
        <li @click="router.push('/board/vocaloid-monthly-main/')">月刊</li>
        <li @click="router.push('/board/vocaloid-special')">特刊</li>
        <li @click="router.push('/pool')">统计</li>
        <li @click="router.push('/about')">关于</li>
      </ul>
    </nav>
    <el-drawer direction="ltr" v-model="asideVisible" :with-header="false" style="background: rgba(255,255,255,0.2);backdrop-filter: blur(12px);">
      <aside>
        <ul>
          <li @click="router.push('/')">首页</li>
          <li @click="router.push('/board/vocaloid-daily-main/')">日刊</li>
          <li @click="router.push('/board/vocaloid-weekly-main/')">周刊</li>
          <li @click="router.push('/board/vocaloid-monthly-main/')">月刊</li>
          <li @click="router.push('/board/vocaloid-special')">特刊</li>
          <li @click="router.push('/pool')">统计</li>
          <li @click="router.push('/about')">关于</li>
        </ul>
      </aside>
    </el-drawer>

  </header>
</template>

<script setup>
import { ref } from 'vue';
import router from '../router/index.ts'
import { Search } from '@element-plus/icons-vue'
import { Menu } from '@element-plus/icons-vue' // 菜单图标

const asideVisible = ref(false)

function logoClicked() {
  if(document.documentElement.clientWidth > 630) {
    router.push('/')
  } else {
    asideVisible.value = !asideVisible.value
  }
}


</script>

<style lang="scss" scoped>


header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9); /* 调整透明度，增加背景亮度 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

nav {
  display: inline flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: rgba(46, 196, 255, 0.6); /* 主背景色 */
  backdrop-filter: blur(8px);

  #logoheader {
    font-family: 'Arial', sans-serif; /* 使用现代无衬线字体 */
    font-size: 24px; 
    font-weight: bold; 
    color: #fcfcfc; 
    padding: 10px 20px; /* 内边距 */
    display: inline flex;
    height: 50px;
    padding: 0px 10px;

    flex-direction: row;
    align-items: center;
    gap: 10px;


    img {
      height: 40px;
    }
  }
}

nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: inline flex;
  justify-content: center;
  font-size: 18px; /* 调整字体大小 */
  color: white;
  overflow: hidden; /* 确保子元素不超出圆角区域 */
  position: relative;
  padding-right: 50px;

  li {
    padding: 15px 15px;
    cursor: pointer; /* 鼠标样式 */
    border-radius: 10px; /* 每个导航项的圆角 */
    transition: background-color 0.3s ease, transform 0.3s ease; /* 添加平滑过渡 */

    img {
      height: 30px;
    }
  }

  li:hover {
    background-color: rgba(255, 255, 255, 0.2); /* 悬停时背景色变化 */
    transform: scale(1.03); /* 悬停时放大效果 */
  }

  li a {
    text-decoration: none;
    color: white;
    font-weight: 500; /* 调整字体粗细 */
  }
}

:global(.el-drawer) {
  background-color: #80ceff;
}

aside ul {
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  list-style: none;
  font-size: 18px;
  color: white;


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
    color: white;
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
    color: #ffffff;
    font-size: 18px;
  }
}


@media (max-width: 630px) {
  nav {
  display: inline flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: rgba(46, 196, 255, 0.5); /* 主背景色 */
  backdrop-filter: blur(12px);
  }
  nav li:not(#logoheader) {
    display: none;
  }

#logoheader {
  display: block;
  align-items: center;
  margin: 0 auto;
  font-family: 'Arial', sans-serif; /* 使用现代无衬线字体 */
  font-size: 25px; 
  font-weight: bold; 
  color: #fcfcfc; 
  padding: 10px 10px; /* 内边距 */
  transform: translateX(20px);
}
#menu-button {
  color: #ffffff;
    font-size: 24px;
    margin-left: 5px; /* 安全边距 */
    order: -1; /* 强制最左侧 */
    transform: translateX(-1px); /* 微调对齐 */
    margin: 10px;
  }

  #search-mobile {
    color: #ffffff;
    margin-left: 5px; /* 安全边距 */
    order: 1; /* 强制最左侧 */
    transform: translateX(-5px); /* 微调对齐 */
  }
}


  @media (min-width: 631px) {
  // 这里添加宽度大于630px时的样式
  #menu-button {
    display: none; // 在大屏幕上隐藏菜单按钮
  }
  #search-mobile {
    display: none; // 在大屏幕上隐藏搜索按钮
  }
}
</style>