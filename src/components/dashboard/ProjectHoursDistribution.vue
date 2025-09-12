<template>
  <div class="distribution-chart">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

// 注册Chart.js组件
Chart.register(...registerables)

const chartRef = ref(null)
let chartInstance = null

// 接收外部数据
const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      labels: ['产品A', '产品B', '产品C', '基础平台'],
      datasets: [{
        data: [120, 180, 95, 91],
        backgroundColor: [
          'rgba(22, 93, 255, 0.7)',
          'rgba(0, 180, 42, 0.7)',
          'rgba(255, 125, 0, 0.7)',
          'rgba(126, 87, 194, 0.7)'
        ],
        borderColor: [
          'rgba(22, 93, 255, 1)',
          'rgba(0, 180, 42, 1)',
          'rgba(255, 125, 0, 1)',
          'rgba(126, 87, 194, 1)'
        ],
        borderWidth: 1
      }]
    })
  }
})

// 创建图表
const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  const ctx = chartRef.value.getContext('2d')
  
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: props.data,
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
              const value = context.raw || 0;
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
watch(() => props.data, () => {
  createChart()
}, { deep: true })

// 挂载时创建图表
onMounted(() => {
  createChart()
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