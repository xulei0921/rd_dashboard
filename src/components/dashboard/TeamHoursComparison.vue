<template>
  <div class="comparison-chart">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading">
      <span class="spinner"></span> 加载团队工时数据中...
    </div>
    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      ❌ 数据加载失败：{{ error }}
    </div>
    <!-- 无数据状态 -->
    <div v-else-if="!chartData.labels.length" class="empty">
      📊 暂无团队工时数据
    </div>
    <!-- 图表容器 -->
    <canvas v-else ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import request from '@/utils/request'
import { useTeamStore } from '@/store'

const teamStore = useTeamStore()

const {
        getTeamWorkHoursComparison
      } = teamStore

// 注册Chart.js组件
Chart.register(...registerables)

const chartRef = ref(null)
let chartInstance = null

// 状态管理
const isLoading = ref(true)
const error = ref(null)
const chartData = ref({
  labels: [],
  datasets: []
})

// 团队颜色配置
const teamColors = {
  '研发': 'rgba(22, 93, 255, 0.7)',
  '测试': 'rgba(0, 180, 42, 0.7)',
  '项目经理': 'rgba(255, 125, 0, 0.7)',
  '其他': 'rgba(126, 87, 194, 0.7)',
  // 可以添加更多团队的颜色
}

// 获取团队颜色，如果没有配置则生成随机颜色
const getTeamColor = (teamName) => {
  if (teamColors[teamName]) {
    return teamColors[teamName]
  }
  
  // 生成随机颜色
  const randomColor = () => Math.floor(Math.random() * 255)
  return `rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 0.7)`
}

// 处理后端数据为图表所需格式
const processData = (rawData) => {
  // 获取所有唯一的团队名称
  const teams = [...new Set(rawData.map(item => item.teamName))]
  
  // 获取所有唯一的月份并排序
  const months = [...new Set(rawData.map(item => item.month))].sort()
  
  // 为每个团队创建数据集
  const datasets = teams.map(team => {
    // 收集该团队每个月的工时数据
    const data = months.map(month => {
      // 寻找当前遍历团队以及月份对应的数据，双重匹配，确定数据唯一性
      const item = rawData.find(i => i.teamName === team && i.month === month)
      return item ? item.monthlyHours : 0
    })
    
    // 每个团队为一组数据
    return {
      label: team,
      data: data,
      backgroundColor: getTeamColor(team),
      borderWidth: 1
    }
  })
  
  return {
    // x轴标签
    labels: months.map(monthStr => {
      // 格式化月份显示（例如：2025-01 → 1月）
      const [year, month] = monthStr.split('-')
      return `${month}月`
    }),
    datasets: datasets
  }
}

// 从后端获取数据
const fetchTeamHoursData = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const response = await request.get('data/teamWorkHoursComparison')

    if (response.code === 200 && response.success) {
      const processedData = processData(response.data)
      // console.log(processedData)
      chartData.value = processedData
    } else {
      throw new Error(response.message || '获取团队工时数据失败')
    }
  } catch (err) {
    error.value = err.message
    console.error('获取团队工时数据出错:', err)
  } finally {
    isLoading.value = false
  }
}

// 创建图表
const createChart = () => {
  if (!chartRef.value){
    return
  }
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  const ctx = chartRef.value.getContext('2d')
  
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: chartData.value,
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
          },
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
                label += context.parsed.y.toFixed(1) + '小时';
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
            text: '工时 (小时)'
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

// 监听数据变化，更新图表
watch(chartData, () => {
  if (!isLoading.value && !error.value) {
    createChart()
  }
}, { deep: true })

// 监听窗口大小变化，调整图表尺寸
watch(
  () => window.innerWidth,
  () => {
    if (chartInstance) {
      chartInstance.resize()
    }
  }
)

// 组件挂载时获取数据并创建图表
onMounted(async () => {
  await fetchTeamHoursData()
  if (!error.value) {
    createChart()
  }
})

// 组件卸载时销毁图表实例
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
  min-height: 300px;
  position: relative;
}

.loading, .error, .empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 20px;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(22, 93, 255, 0.3);
  border-radius: 50%;
  border-top-color: #165DFF;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  color: #ff4d4f;
}

.empty {
  color: #8c8c8c;
}
</style>