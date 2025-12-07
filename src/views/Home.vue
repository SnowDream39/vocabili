<template>
  <div class="min-h-screen bg-surface">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary/10 to-tertiary/10 py-8 lg:py-12 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-on-surface mb-3 lg:mb-4">
          术力口数据库
        </h1>
        <p class="text-base lg:text-lg text-on-surface-variant mb-6 lg:mb-8">
          追踪 VOCALOID 音乐的最新动态与历史数据
        </p>
        <div class="flex flex-wrap justify-center gap-3 lg:gap-4">
          <div class="bg-surface-container px-4 lg:px-6 py-2 lg:py-3 rounded-full shadow-sm">
            <span class="text-xs lg:text-sm text-on-surface-variant">今日刊号</span>
            <span class="ml-1 lg:ml-2 font-semibold text-primary text-sm lg:text-base">{{ today?.toFormat('yyyy-MM-dd') || '加载中...' }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- 最新排行 -->
        <section class="w-full lg:w-auto lg:flex-shrink-0">
          <div class="bg-surface-container rounded-2xl shadow-lg overflow-hidden">
            <div class="bg-primary p-4 lg:p-6 text-white">
              <h2 class="text-xl lg:text-2xl font-bold flex items-center gap-2">
                <svg class="w-5 lg:w-6 h-5 lg:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                最新排行
              </h2>
            </div>
            <div class="p-4 lg:p-6">
              <LatestRanking :today="today" />
            </div>
          </div>
        </section>

        <!-- 排行榜日历 -->
        <section class="flex-1 w-full">
          <div class="bg-surface-container rounded-2xl shadow-lg overflow-hidden">
            <div class="bg-tertiary p-4 lg:p-6 text-on-tertiary">
              <h2 class="text-xl lg:text-2xl font-bold flex items-center gap-2">
                <svg class="w-5 lg:w-6 h-5 lg:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                </svg>
                排行榜日历
              </h2>
            </div>
            <div class="p-4 lg:p-6">
              <RankingCalendar :today="today" />
            </div>
          </div>
        </section>
      </div>

      <!-- 快速导航 -->
      <section class="mt-8 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div class="bg-surface-variant rounded-xl p-4 lg:p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div class="text-2xl lg:text-3xl mb-2 lg:mb-3">📊</div>
          <h3 class="text-base lg:text-lg font-semibold text-on-surface-variant mb-1 lg:mb-2">日刊排行</h3>
          <p class="text-xs lg:text-sm text-on-surface-variant mb-3 lg:mb-4">每日更新的 VOCALOID 排行榜</p>
          <el-button type="primary" size="small" @click="navigateToRanking('vocaloid-daily')">查看详情</el-button>
        </div>

        <div class="bg-surface-variant rounded-xl p-4 lg:p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div class="text-2xl lg:text-3xl mb-2 lg:mb-3">🏆</div>
          <h3 class="text-base lg:text-lg font-semibold text-on-surface-variant mb-1 lg:mb-2">周刊排行</h3>
          <p class="text-xs lg:text-sm text-on-surface-variant mb-3 lg:mb-4">每周精选的 VOCALOID 音乐作品</p>
          <el-button type="primary" size="small" @click="navigateToRanking('vocaloid-weekly')">查看详情</el-button>
        </div>

        <div class="bg-surface-variant rounded-xl p-4 lg:p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div class="text-2xl lg:text-3xl mb-2 lg:mb-3">🎭</div>
          <h3 class="text-base lg:text-lg font-semibold text-on-surface-variant mb-1 lg:mb-2">月刊排行</h3>
          <p class="text-xs lg:text-sm text-on-surface-variant mb-3 lg:mb-4">每月最佳的 VOCALOID 音乐精选</p>
          <el-button type="primary" size="small" @click="navigateToRanking('vocaloid-monthly')">查看详情</el-button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">

import LatestRanking from '@/components/LatestRanking.vue';
import RankingCalendar from '../components/RankingCalendar.vue';
import { DateTime } from 'luxon';
import api from '@/utils/api/api';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElButton } from 'element-plus';

const router = useRouter();
const today = ref<DateTime | null>(null);

/**
 * 最新一期是哪天的
 */
async function getToday(): Promise<DateTime> {
  const latestIssue = await api.getLatestRanking('vocaloid-daily')
  return DateTime.local(2024,7,2).plus({days: latestIssue})
}

function navigateToRanking(boardType: string) {
  if (today.value) {
    const issue = Math.ceil(today.value.diff(DateTime.local(2024, 7, 2)).as('days'));
    router.push(`/board/${boardType}/${issue}`);
  }
}

onMounted(() => {
  getToday().then(date => {
    today.value = date
  })
})
</script>
<style scoped>
/* Hero Section 动画效果 */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right,
    color-mix(in srgb, var(--md-sys-color-primary) 10%, transparent),
    color-mix(in srgb, var(--md-sys-color-tertiary) 10%, transparent)
  );
}

/* 卡片悬停效果 */
.hover\:shadow-lg {
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.hover\:shadow-lg:hover {
  transform: translateY(-2px);
}

/* 快速导航卡片特殊样式 */
.bg-surface-variant {
  background-color: var(--md-sys-color-surface-variant);
  transition: all 0.3s ease;
}

.bg-surface-variant:hover {
  background-color: var(--md-sys-color-surface-container);
}

/* 响应式间距 */
@media (max-width: 768px) {
  .py-12 {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
}

/* 标题动画 */
.text-4xl, .text-5xl {
  background: linear-gradient(135deg, var(--md-sys-color-primary), var(--md-sys-color-tertiary));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>
