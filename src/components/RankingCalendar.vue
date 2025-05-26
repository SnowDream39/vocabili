<template>
  <div class="calendar">
    <div v-for="month in months" class="calendar-month">
      <button @click="month.disabled ? undefined : jumpToBoard('monthly', month.issueNum)" class="month-btn">{{ month.dateString }}</button>
      <div class="calendar-body">
        <div
          v-for="week in month.weeks"
          class="week"
          :key="week"
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
            :key="day.date"
            @click="day.disabled ? undefined : jumpToBoard('daily', day.issueNum)"
          >
            {{ day.dateString }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { DateTime } from 'luxon';
import router from '../router';
import { requester } from '../utils/requester';
import Board from '../utils/board';

const today = ref(DateTime.local().plus({days: -2}))

async function getToday() {
  const firstDate = DateTime.local(2024,7,2)
  const data = await requester.get_board(new Board("vocaloid-daily-main"), undefined, 1)
  const issueNum = data.metadata.issue
  return firstDate.plus({days: issueNum})
}

// 月份列表，日期均存储于此
const months = ref([])

watch(today, () => {
  months.value = []

  let currentMonth = DateTime.local(2024, 7);
  while (currentMonth <= today.value) {
    // 月末日期
    const startOfMonth = currentMonth.set({});
    const endOfMonth = currentMonth.endOf('month');

    const month = {
      dateString: currentMonth.toFormat('yyyy-MM'),
      issueNum: Math.ceil(currentMonth.diff(DateTime.local(2024, 7, 1)).as('months')),
      disabled: endOfMonth > today.value,
      weeks: []
    }

    let currentWeek = startOfMonth.startOf('week');
    
    // 确保只处理当月的日期
    while (currentWeek <= DateTime.min(endOfMonth, today.value)) {
      const startOfWeek = currentWeek.startOf('week');
      const endOfWeek = currentWeek.endOf('week');

      const week = {
        dateString: currentWeek.toFormat('EEE'),
        issueNum: Math.ceil(currentWeek.diff(DateTime.local(2024, 8, 31)).as('weeks')),
        disabled: endOfWeek.plus({ days: -1 }) > today.value || endOfWeek < DateTime.local(2024, 9, 7),
        days: []
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

function jumpToBoard(board, issue) {
  router.push(`/board/vocaloid-${board}-main/${issue}`)
}


// 点击日期事件
const handleDayClick = (day) => {
  console.log(`点击了日期: ${day.date.toISODate()}`);
  // 可以调用其他函数
};

// 点击一周的按钮事件
const handleWeekClick = (week) => {
  console.log('点击了这一周:', week);
  // 可以调用其他函数
};


onMounted(init)
</script>

<style scoped>
.calendar {
  width: 300px;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(250,250,250,0.5); 
  border-radius: 12px; /* 圆角边框 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 轻微阴影，增加层次感 */
}

.calendar-month {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  color: #333; /* 深色字体，增强可读性 */
  margin-bottom: 20px; /* 月份之间间隔 */
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
