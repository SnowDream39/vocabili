<template>
  <button v-if="showButton" @click="scrollToTop" class="scroll-to-top">
    <div class="i-material-symbols-keyboard-arrow-up text-4xl"></div>
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const showButton = ref(false);

// 判断页面滚动位置，超过300px显示按钮
const checkScrollPosition = () => {
  showButton.value = window.scrollY > 300;
};

// 滚动到页面顶部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 监听页面滚动
onMounted(() => {
  window.addEventListener('scroll', checkScrollPosition);
});

// 清除事件监听器
onUnmounted(() => {
  window.removeEventListener('scroll', checkScrollPosition);
});
</script>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background-color: var(--md-sys-color-primary); /* 背景色 */
  color: white;
  border: none;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s, transform 0.3s; /* 添加平滑过渡 */
  z-index: 9999; /* 保证按钮位于顶部 */
}

.scroll-to-top:hover {
  opacity: 1;
  transform: scale(1.03); /* 鼠标悬停时放大 */
}

/* 移动端优化，按钮位置和大小适应不同屏幕 */
@media (max-width: 480px) {
  .scroll-to-top {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
  }

  .scroll-to-top i {
    font-size: 20px;
  }
}
</style>
