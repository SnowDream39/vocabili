<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { ref } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

// 注册Chart.js插件
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

// 生成100个数据点
const generateData = () => {
  return Array.from({ length: 100 }, (_, index) => Math.floor(Math.random() * 100)); // 随机数据
};

// 响应式数据
const chartData = ref({
  labels: Array.from({ length: 100 }, (_, index) => index + 1), // x轴标签 1到100
  datasets: [
    {
      label: 'Sample Data',
      data: generateData(),
      borderColor: '#42A5F5',
      backgroundColor: 'transparent', // 背景色透明
      fill: false, // 不填充区域
      tension: 0.4, // 平滑曲线
      pointRadius: 0, // 不显示点
    },
  ],
});

// 配置选项
const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
  scales: {
    x: {
      ticks: {
        stepSize: 10, // 每10个标签一个刻度
      },
    },
    y: {
      beginAtZero: true, // y轴从零开始
    },
  },
});
</script>