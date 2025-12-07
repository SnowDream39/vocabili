<template>
  <div class="calendar-container">
    <!-- 月份选择器 -->
    <div class="month-selector mb-4">
      <div class="flex items-center justify-center gap-4">
        <button
          @click="previousMonth"
          :disabled="selectedMonthIndex === months.length - 1"
          class="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </button>

        <select
          v-model="selectedMonthIndex"
          class="px-4 py-2 rounded-lg bg-surface-container border border-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option v-for="(month, index) in months" :key="month.dateString" :value="index">
            {{ formatMonthDisplay(month.dateString) }}
          </option>
        </select>

        <button
          @click="nextMonth"
          :disabled="selectedMonthIndex === 0"
          class="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 日历内容 -->
    <div class="calendar mx-auto" style="width: fit-content;">
      <div v-if="currentMonth" class="calendar-month">
        <div class="calendar-body">
          <div class="week">
            <button
              @click="currentMonth.disabled ? undefined : jumpToBoard('monthly', currentMonth.issueNum)"
              class="month-compact-btn"
              :class="{ 'month-compact-btn-disabled': currentMonth.disabled }"
              :title="formatMonthDisplay(currentMonth.dateString)"
            >
              月
            </button>
            <div class="day-header" v-for="day in weekDays">{{ day }}</div>
          </div>
          <div
            v-for="week in currentMonth.weeks"
            class="week"
            :key="week.dateString"
          >
            <button
              class="week-button"
              :class="week.disabled ? 'week-button-disabled' : 'week-button-enabled'"
              @click="week.disabled ? undefined : jumpToBoard('weekly', week.issueNum)"
            >
              {{ week.issueNum }}
            </button>
            <div
              v-for="day in week.days"
              class="day"
              :class="day.disabled ? 'day-disabled' : 'day-enabled'"
              :key="day.dateString"
              @click="day.disabled ? undefined : jumpToBoard('daily', day.issueNum)"
            >
              {{ day.dateString }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { DateTime } from 'luxon';
import router from '../router';

const props =  defineProps<{
  today: DateTime | null;
}>()

const weekDays = [
  '六','日', '一', '二', '三', '四', '五',
];

const today = ref<DateTime>(DateTime.local().plus({days: -2}))
watch(props, () => {
  if (props.today) {
    today.value = props.today
  }
}, {immediate: true})

interface MonthConfig {
  dateString: string;
  issueNum: number;
  disabled: boolean;
  weeks: WeekConfig[];
}

interface WeekConfig {
  dateString: string;
  issueNum: number;
  disabled: boolean;
  days: DayConfig[];
}


interface DayConfig {
  dateString: string;
  issueNum: number;
  disabled: boolean;
}



// 月份列表，日期均存储于此
const months = ref<MonthConfig[]>([])
const selectedMonthIndex = ref(0)

// 当前显示的月份
const currentMonth = computed(() => {
  return months.value[selectedMonthIndex.value] || null
})

watch(today, () => {
  months.value = []

  let currentMonth = DateTime.local(2024, 7);
  while (currentMonth <= today.value) {
    // 月末日期
    const startOfMonth = currentMonth.set({});
    const endOfMonth = currentMonth.endOf('month');  // 是下一个月的前一毫秒

    const month = {
      dateString: currentMonth.toFormat('yyyy-MM'),
      issueNum: Math.ceil(currentMonth.diff(DateTime.local(2024, 7, 1)).as('months')),
      disabled: endOfMonth > today.value.plus({ days: 1 }),
      weeks: [] as any[]
    }

    // 接下来处理周。显示的一周是从周六开始的
    let currentWeek = startOfMonth.weekday <= 5 ? startOfMonth.startOf('week').plus({ days: -2 }) : startOfMonth.startOf('week').plus({ days: 5 });

    // 判断是否为当前月份
    const isCurrentMonth = currentMonth.toFormat('yyyy-MM') === today.value.toFormat('yyyy-MM');

    // 对于当前月份，显示到月末（完整月历）；对于历史月份，只显示到今天
    const weekLimit = isCurrentMonth ? endOfMonth : DateTime.min(endOfMonth, today.value);

    // 确保只处理当月的日期
    while (currentWeek <= weekLimit) {
      const startOfWeek = currentWeek;
      const endOfWeek = currentWeek.plus({ days: 7, milliseconds: -1});  // 是下周的前一毫秒

      // 判断是否为未来的周
      const isFutureWeek = isCurrentMonth && (startOfWeek > today.value || endOfWeek > today.value);

      const week = {
        dateString: currentWeek.toFormat('EEE'),
        issueNum: Math.ceil(currentWeek.diff(DateTime.local(2024, 8, 24)).as('weeks')),
        disabled: isFutureWeek || endOfWeek.plus({ days: -2 }) > today.value || endOfWeek < DateTime.local(2024, 8, 31),
        days: [] as any[]
      }


      let currentDay = startOfWeek.set({});

      // 对于当前月份，显示完整周；对于历史月份，显示到今天
      const dayLimit = isCurrentMonth ? endOfWeek : DateTime.min(endOfWeek, today.value);

      // 确保只处理当前星期的日期
      while (currentDay <= dayLimit) {
        // 对于当前月份，未来的日期要显示但设为不可点击
        const isFutureDay = isCurrentMonth && currentDay > today.value;

        const day = {
          dateString: currentDay.toFormat('dd'),
          issueNum: Math.ceil(currentDay.diff(DateTime.local(2024, 7, 2)).as('days')),
          disabled: isFutureDay || currentDay > endOfMonth || currentDay < startOfMonth
        }
        week.days.push(day)

        // 推进到下一个日期
        currentDay = currentDay.plus({ days: 1 });
      }

      month.weeks.push(week);

      // 推进到下一个星期的第一天（可以直接用 endOfWeek 来更新 currentDate）
      currentWeek = currentWeek.plus({ weeks: 1 });
    }

    months.value.push(month);

    // 推进到下一个月的第一天
    currentMonth = currentMonth.plus({ months: 1 });
  }

  months.value.reverse()

  // 默认选择当前月份
  if (months.value.length > 0) {
    selectedMonthIndex.value = 0
  }

}, {immediate: true})

// 月份导航功能
function previousMonth() {
  // 左按钮：向更早的月份（索引增加）
  if (selectedMonthIndex.value < months.value.length - 1) {
    selectedMonthIndex.value++
  }
}

function nextMonth() {
  // 右按钮：向更晚的月份（索引减少）
  if (selectedMonthIndex.value > 0) {
    selectedMonthIndex.value--
  }
}

// 格式化月份显示
function formatMonthDisplay(dateString: string): string {
  const dt = DateTime.fromFormat(dateString, 'yyyy-MM')
  return dt.toFormat('yyyy年 MM月')
}



function jumpToBoard(board: string, issue: number) {
  router.push(`/board/vocaloid-${board}/${issue}`)
}

</script>

<style scoped>
.calendar-container {
  max-width: 100%;
}

.month-selector {
  text-align: center;
}

.calendar {
  text-align: center;
}

.calendar-month {
  font-size: 18px;
  font-weight: 600;
  color: var(--md-sys-color-on-surface);
  display: inline-block;
  padding: 0px 10px;
}

.month-btn {
  margin-bottom: 10px;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 500;
  background-color: var(--md-sys-color-tertiary); /* 按钮背景 */
  border: none;
  border-radius: 8px; /* 圆角按钮 */
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.month-btn:hover {
  background-color: color-mix(in srgb, var(--md-sys-color-tertiary) 80%, white); /* 悬停效果 */
}

.month-compact-btn {
  width: 32px;
  height: 32px;
  background-color: var(--md-sys-color-tertiary-container);
  color: var(--md-sys-color-on-tertiary-container);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.month-compact-btn:hover:not(.month-compact-btn-disabled) {
  background-color: var(--md-sys-color-tertiary);
  color: var(--md-sys-color-on-tertiary);
}

.month-compact-btn-disabled {
  color: var(--md-sys-color-on-surface-variant);
  opacity: 0.4;
  cursor: not-allowed;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 15px;
}

.day-header {
  width: 32px;
  height: 32px;
  text-align: center;
  font-weight: 600;
  color: var(--md-sys-color-on-surface-variant);
  line-height: 32px;
  font-size: 12px;
}

.calendar-body {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.week {
  display: flex;
  justify-content: space-between;
  gap: 5px;
}

.week-button {
  width: 32px;
  height: 32px;
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.week-button-disabled {
  color: var(--md-sys-color-on-surface-variant);
  opacity: 0.4;
  cursor: not-allowed;
}

.week-button-enabled:hover {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

.day {
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 6px;
  font-size: 13px;
  transition: all 0.2s ease;
}

.day-enabled {
  color: var(--md-sys-color-on-surface);
  cursor: pointer;
  background-color: var(--md-sys-color-surface-container);

  &:hover {
    background-color: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);
  }
}

.day-disabled {
  color: var(--md-sys-color-on-surface-variant);
  opacity: 0.4;
}



</style>
