<template>
  <div class="distribution-chart">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { generateRandomColorPairs } from '@/utils/colorUtils'

import { useProjectStore } from '@/store'
import { storeToRefs } from 'pinia'
const projectStore = useProjectStore()

const {
        projectName,
        totalConsumed
      } = storeToRefs(projectStore)

const {
        fetchProjWorkHoursDistribution
      } = projectStore

// 注册Chart.js组件
Chart.register(...registerables)

const chartRef = ref(null)
let chartInstance = null

// 创建图表
const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  const ctx = chartRef.value.getContext('2d')

  // 根据数组长度生成随机颜色
  const dataLength = projectName.value.length
  const randomColors = generateRandomColorPairs(dataLength)
  
  // 提取边框色和背景色数组
  const backgroundColor = randomColors.map(item => item.backgroundColor)
  // const borderColor = randomColors.map(item => item.borderColor)

  // 使用从store获取的数据
  const chartData = {
    labels: projectName.value,
    datasets: [{
      data: totalConsumed.value,
      backgroundColor: backgroundColor,
      // borderColor: borderColor,
      borderWidth: 1
    }]
  }

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw.toFixed(2) || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value}人天 (${percentage}%)`;
            }
          }
        }
      },
      cutout: '65%',
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1500
      }
    }
  })
}

// 监听数据变化
watch([projectName, totalConsumed], () => {
  createChart()
}, { deep: true })

// 挂载时创建图表
onMounted(() => {
  createChart()
  fetchProjWorkHoursDistribution()
})

// 监听窗口大小变化
watch(
  () => window.innerWidth,
  () => {
    if (chartInstance) {
      chartInstance.resize()
    }
  }
)

// 组件卸载时清理
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<style scoped>
.distribution-chart {
  width: 100%;
  height: 100%;
}
</style>