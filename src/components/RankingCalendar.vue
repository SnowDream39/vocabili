<template>
  <div class="calendar grid grid-cols-1 lg:grid-cols-2">
    <div v-for="month in months" class="calendar-month">
      <button @click="month.disabled ? undefined : jumpToBoard('monthly', month.issueNum)" class="month-btn">{{ month.dateString }}</button>
      <div class="calendar-body">
        <div class="week">
          <div class="day" v-for="day in weekDays">{{ day }}</div>
        </div>
        <div
          v-for="week in month.weeks"
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
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { DateTime } from 'luxon';
import router from '../router';
import { requester } from '../utils/api/requester';
import Board from '../utils/board';

const weekDays = [
  '','六','日', '一', '二', '三', '四', '五',
];

const today = ref<DateTime>(DateTime.local().plus({days: -2}))

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

/**
 * 最新一期是哪天的
 */
async function getToday(): Promise<DateTime> {
  const firstDate = DateTime.local(2024,7,2)
  const data = await requester.get_board(new Board("vocaloid-daily-main", -1), undefined, 1)
  const issueNum = data.metadata.issue
  return firstDate.plus({days: issueNum})
}

// 月份列表，日期均存储于此
const months = ref<MonthConfig[]>([])

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

    // 确保只处理当月的日期
    while (currentWeek <= DateTime.min(endOfMonth, today.value)) {
      const startOfWeek = currentWeek;
      const endOfWeek = currentWeek.plus({ days: 7, milliseconds: -1});  // 是下周的前一毫秒

      const week = {
        dateString: currentWeek.toFormat('EEE'),
        issueNum: Math.ceil(currentWeek.diff(DateTime.local(2024, 8, 24)).as('weeks')),
        disabled: endOfWeek.plus({ days: -2 }) > today.value || endOfWeek < DateTime.local(2024, 8, 31),
        days: [] as any[]
      }


      let currentDay = startOfWeek.set({});
      // 确保只处理当前星期的日期
      while (currentDay <= DateTime.min(endOfWeek)) {
        const day = {
          dateString: currentDay.toFormat('dd'),
          issueNum: Math.ceil(currentDay.diff(DateTime.local(2024, 7, 2)).as('days')),
          disabled: currentDay > endOfMonth || currentDay < startOfMonth || currentDay > today.value
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


}, {immediate: true})

async function init() {
  today.value = await getToday()
}

function jumpToBoard(board: string, issue: number) {
  router.push(`/board/vocaloid-${board}-main/${issue}`)
}

onMounted(init)
</script>

<style scoped>
.calendar {
  box-sizing: border-box;
  padding: 20px;
}

.calendar-month {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  color: #333; /* 深色字体，增强可读性 */
  margin-bottom: 20px; /* 月份之间间隔 */
  width: 280px;
  padding: 0px 10px;
}

.month-btn {
  margin-bottom: 10px;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 500;
  background-color: #80ceff; /* 按钮背景 */
  color: white;
  border: none;
  border-radius: 8px; /* 圆角按钮 */
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.month-btn:hover {
  background-color: #66b8e3; /* 悬停效果 */
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 15px;
}

.week-day {
  width: 30px;
  text-align: center;
  font-weight: 600;
  color: #555; /* 显示周几时，采用深灰色 */
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
  width: 30px;
  height: 30px;
  background-color: #f0f0f0; /* 按钮背景 */
  color: #333; /* 按钮字体颜色 */
  border: none;
  border-radius: 8px; /* 圆角 */
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.week-button-disabled {
  color: #e1e1e1;
}

.week-button-enabled:hover {
  background-color: #e1e1e1; /* 悬停时背景色变化 */
}

.day {
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 8px; /* 圆角 */
  font-size: 14px;
}

.day-enabled {

  color: #333;
  cursor: pointer;

  &:hover {
    background-color: #e1e1e1;
  }
}

.day-disabled {
  color: #e1e1e1;
}

@media (prefers-color-scheme: dark) {
  .day-enabled {
    color: #e1e1e1;

    &:hover {
      color: black;
    }
  }

  .day-disabled {
    color: pink;
  }
}

</style>
