<template>
  <div class="comparison-chart">
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
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      datasets: [
        {
          label: '前端团队',
          data: [35, 42, 50, 45, 55, 60],
          backgroundColor: 'rgba(22, 93, 255, 0.7)',
        },
        {
          label: '后端团队',
          data: [45, 50, 55, 60, 65, 70],
          backgroundColor: 'rgba(0, 180, 42, 0.7)',
        },
        {
          label: '测试团队',
          data: [25, 30, 35, 40, 45, 50],
          backgroundColor: 'rgba(255, 125, 0, 0.7)',
        },
        {
          label: '数据团队',
          data: [15, 20, 25, 30, 35, 40],
          backgroundColor: 'rgba(126, 87, 194, 0.7)',
        }
      ]
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
    type: 'bar',
    data: props.data,
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
                label += context.parsed.y + '人天';
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '工时 (人天)'
          }
        },
        x: {
          title: {
            display: true,
            text: '月份'
          }
        }
      },
      animation: {
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
.comparison-chart {
  width: 100%;
  height: 100%;
}
</style>