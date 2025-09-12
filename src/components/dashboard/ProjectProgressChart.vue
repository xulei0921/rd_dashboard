
<template>
  <div class="progress-chart">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted,onUnmounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

// 注册Chart.js组件
Chart.register(...registerables)

const chartRef = ref(null)
let chartInstance = null

// 图表数据
const chartData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  datasets: [
    {
      label: '产品A',
      data: [0, 15, 30, 45, 58, 68],
      borderColor: '#165DFF',
      backgroundColor: 'rgba(22, 93, 255, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: '#165DFF'
    },
    {
      label: '产品B',
      data: [0, 0, 10, 35, 60, 82],
      borderColor: '#00B42A',
      backgroundColor: 'rgba(0, 180, 42, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: '#00B42A'
    },
    {
      label: '产品C',
      data: [0, 0, 0, 10, 30, 45],
      borderColor: '#FF7D00',
      backgroundColor: 'rgba(255, 125, 0, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: '#FF7D00'
    },
    {
      label: '基础平台',
      data: [0, 5, 20, 35, 50, 65],
      borderColor: '#7E57C2',
      backgroundColor: 'rgba(126, 87, 194, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: '#7E57C2'
    }
  ]
}

// 创建图表
const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  const ctx = chartRef.value.getContext('2d')
  
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y + '%';
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: '完成进度 (%)'
          },
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        },
        x: {
          title: {
            display: true,
            text: '月份'
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      animation: {
        duration: 1500
      }
    }
  })
}

// 挂载时创建图表
onMounted(() => {
  createChart()
})

// 组件卸载时销毁图表
const cleanup = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }
}

// 监听窗口大小变化，重绘图表
watch(
  () => window.innerWidth,
  () => {
    if (chartInstance) {
      chartInstance.resize()
    }
  }
)

// 组件卸载时清理
onUnmounted(cleanup)
</script>

<style scoped>
.progress-chart {
  width: 100%;
  height: 100%;
}
</style>
