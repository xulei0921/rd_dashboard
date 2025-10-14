<template>
  <div class="progress-chart">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading">
      <span class="spinner"></span> 加载图表数据中...
    </div>
    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      ❌ 数据加载失败：{{ error }}
    </div>
    <!-- 无数据状态 -->
    <div v-else-if="!chartData.labels?.length || !chartData.datasets?.length" class="empty">
      📊 暂无项目进度数据
    </div>
    <!-- 图表容器 -->
    <!-- <canvas v-else ref="chartRef"></canvas> -->
    <div v-else class="canvas-container">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索项目名称..."
        size="small"
        class="search-input"
        clearable
      />
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { generateRandomColorPairs } from '@/utils/colorUtils'
import { fetchProjectProgressTrend } from '@/api/project'

// 1. 注册 Chart.js 必要组件
Chart.register(...registerables)

// 2. 基础 DOM 与实例引用
const chartRef = ref(null)
let chartInstance = null

// 3. 状态管理（加载/错误/数据）
const isLoading = ref(true)
const error = ref(null)
const searchKeyword = ref('')
const chartData = ref({ labels: [], datasets: [] }) // 最终给图表用的完整数据

// 4. 【关键】前端预设样式模板（与后端 series 顺序匹配，支持28个数据集）
// 注：用渐变色系避免样式重复，未用到的数据集样式会自动兜底
const CHART_STYLE_TEMPLATE = {
  // 所有数据集共享的公共样式
  common: {
    tension: 0,    // 曲线平滑度
    fill: true,      // 填充曲线下方区域
    pointRadius: 3,  // 数据点大小
    pointHoverRadius: 6, // 鼠标悬浮时数据点大小
    borderWidth: 2,   // 线条宽度

    // 如果当前数据集全为0，将数据集在图表中的曲线类型改为虚线
    borderDash: (context) => {
      // 判断当前数据集是否全为0
      const isAllZero = context.dataset.data.every(val => val === 0);
      // 「5px 实线 + 3px 空白」的重复模式
      return isAllZero ? [5, 3] : [];
    },
    borderColor: (context) => {
      const isAllZero = context.dataset.data.every(val => val === 0);
      return isAllZero ? '#cccccc' : context.dataset.borderColor;
    },
  },
  // 28个数据集的预设独立样式（按后端 series 顺序配置）
  datasets: [
    { borderColor: '#165DFF', backgroundColor: 'rgba(22, 93, 255, 0.1)' },
    { borderColor: '#00B42A', backgroundColor: 'rgba(0, 180, 42, 0.1)' },
    { borderColor: '#FF7D00', backgroundColor: 'rgba(255, 125, 0, 0.1)' },
    { borderColor: '#7E57C2', backgroundColor: 'rgba(126, 87, 194, 0.1)' },
    { borderColor: '#FF4D4F', backgroundColor: 'rgba(255, 77, 79, 0.1)' },
    { borderColor: '#1890FF', backgroundColor: 'rgba(24, 144, 255, 0.1)' },
    { borderColor: '#00C48C', backgroundColor: 'rgba(0, 196, 140, 0.1)' },
    { borderColor: '#FF9F43', backgroundColor: 'rgba(255, 159, 67, 0.1)' },
    { borderColor: '#6C5CE7', backgroundColor: 'rgba(108, 92, 231, 0.1)' },
    { borderColor: '#A29BFE', backgroundColor: 'rgba(162, 155, 254, 0.1)' },
    { borderColor: '#FD79A8', backgroundColor: 'rgba(253, 121, 168, 0.1)' },
    { borderColor: '#00D2D3', backgroundColor: 'rgba(0, 210, 211, 0.1)' },
    { borderColor: '#FF6B6B', backgroundColor: 'rgba(255, 107, 107, 0.1)' },
    { borderColor: '#4ECDC4', backgroundColor: 'rgba(78, 205, 196, 0.1)' },
    { borderColor: '#45B7D1', backgroundColor: 'rgba(69, 183, 209, 0.1)' },
    { borderColor: '#96CEB4', backgroundColor: 'rgba(150, 206, 180, 0.1)' },
    { borderColor: '#FFEAA7', backgroundColor: 'rgba(255, 234, 167, 0.1)' },
    { borderColor: '#DDA0DD', backgroundColor: 'rgba(221, 160, 221, 0.1)' },
    { borderColor: '#98D8C8', backgroundColor: 'rgba(152, 216, 200, 0.1)' },
    { borderColor: '#F7DC6F', backgroundColor: 'rgba(247, 220, 111, 0.1)' },
    { borderColor: '#BB8FCE', backgroundColor: 'rgba(187, 143, 206, 0.1)' },
    { borderColor: '#85C1E9', backgroundColor: 'rgba(133, 193, 233, 0.1)' },
    { borderColor: '#F8C471', backgroundColor: 'rgba(248, 196, 113, 0.1)' },
    { borderColor: '#82E0AA', backgroundColor: 'rgba(130, 224, 170, 0.1)' },
    { borderColor: '#F1948A', backgroundColor: 'rgba(241, 148, 138, 0.1)' },
    { borderColor: '#ABEBC6', backgroundColor: 'rgba(171, 235, 198, 0.1)' },
    { borderColor: '#85C1E9', backgroundColor: 'rgba(133, 193, 233, 0.1)' },
    { borderColor: '#F7DC6F', backgroundColor: 'rgba(247, 220, 111, 0.1)' }
  ],
  // 兜底样式（若后端 series 数量超预期，用此样式）
  fallback: {
    borderColor: '#999999',
    backgroundColor: 'rgba(153, 153, 153, 0.1)'
  }
}

// 5. 【核心】请求后端数据并解析
const fetchChartData = async () => {
  try {
    isLoading.value = true
    error.value = null

    // 1. 发起请求
    const response = await fetchProjectProgressTrend()

    // const response = await fetchProjectProgressTrend()
    // console.log(response)

    // 2. 检查请求状态（非200抛错）
    if (!response.ok) {
      throw new Error(`请求失败 [${response.status}]: ${response.statusText}`)
    }

    // 3. 解析后端响应（适配JSON格式）
    const backendResp = await response.json()
    // console.log(backendResp)

    // 4. 检查后端业务状态（code≠200视为业务错误）
    if (backendResp.code !== 200 || !backendResp.success) {
      throw new Error(`业务错误: ${backendResp.message || '未知错误'}`)
    }

    // 5. 提取核心数据（months 和 series）
    const { months, series } = backendResp.data || {}
    if (!months || !Array.isArray(months) || !series || !Array.isArray(series)) {
      throw new Error('后端返回数据格式异常（缺少 months 或 series）')
    }

    // 6. 合并数据与样式，生成图表所需格式
    mergeDataAndStyle(months, series)

  } catch (err) {
    // 捕获所有错误并更新状态
    error.value = err.message
    console.error('图表数据加载异常:', err)
  } finally {
    // 无论成功失败，都结束加载状态
    isLoading.value = false
  }
}

// 6. 【核心】合并后端数据与前端样式
const mergeDataAndStyle = (backendMonths, backendSeries) => {
  console.log('后端series数量:', backendSeries.length);

  // 1. 处理标签：直接用后端的 months 作为图表 x 轴标签
  const mergedLabels = backendMonths

  // 2. 处理数据集：逐个合并「后端数据」与「前端样式」
  const mergedDatasets = backendSeries.map((backendItem, index) => {
    // 获取当前数据集的样式（优先用预设，无预设则用兜底）
    const targetStyle = CHART_STYLE_TEMPLATE.datasets[index] || CHART_STYLE_TEMPLATE.fallback

    // 合并顺序：公共样式 → 目标样式 → 后端数据（后端数据优先级最高）
    return {
      ...CHART_STYLE_TEMPLATE.common,
      ...targetStyle,
      label: backendItem.name || `项目${index + 1}`, // 用后端的 name 作为图例名称
      data: backendItem.data || [] // 用后端的 data 作为图表数据
    }
  })

  // 3. 更新最终图表数据（触发图表重绘）
  chartData.value = {
    labels: mergedLabels,
    datasets: mergedDatasets
  }
}

// 7. 创建/更新图表实例
const createOrUpdateChart = () => {
  // 校验前置条件（无DOM/加载中/错误/无数据，不渲染）
  if (!chartRef.value || isLoading.value || error.value || !chartData.value.labels.length) {
    return
  }

  // 销毁旧实例（避免重复渲染导致的性能问题）
  if (chartInstance) {
    chartInstance.destroy()
  }

  // 初始化新图表
  const ctx = chartRef.value.getContext('2d')
  chartInstance = new Chart(ctx, {
    type: 'line', // 图表类型（折线图）
    data: chartData.value,
    options: {
      // 响应式配置（适配不同屏幕尺寸）
      responsive: true,
      maintainAspectRatio: false, // 禁用固定宽高比，让图表填充满容器
      plugins: {
        // 图例配置（项目太多，支持滚动）
        legend: {
          display: window.innerWidth > 768,
          position: 'bottom', // 图例放右侧（避免顶部拥挤）
          labels: {
            boxWidth: 12, // 图例前小方块尺寸
            usePointStyle: true, // 用圆点代替方块
            pointStyle: 'circle',
            maxHeight: 400, // 图例最大高度
            overflow: 'auto' // 超出高度时滚动
          },
        },
        // 提示框配置（鼠标悬浮显示详情）
        tooltip: {
          mode: 'index', // 显示同一x轴位置的所有数据集数据
          intersect: false, // 不要求鼠标精准 hover 到数据点
          callbacks: {
            // 自定义提示框内容（显示项目名 + 进度百分比）
            label: (context) => `${context.dataset.label}: ${context.parsed.y || 0}%`
          }
        },
        // 标题配置（图表顶部标题）
        title: {
          display: true,
          text: '各项目进度趋势图（1-9月）',
          font: { size: 16, weight: 'bold' },
          padding: { bottom: 30 }
        }
      },
      // 坐标轴配置
      scales: {
        y: {
          beginAtZero: true, // y轴从0开始
          // max: 100, // y轴最大值（进度百分比，最大100）
          max: (context) => {
            // 获取所有数据集的最大值
            const allValues = context.chart.data.datasets.flatMap(dataset => dataset.data);
            const maxValue = Math.max(...allValues);
            // 最大值基础上增加10%作为缓冲，确保数据点不贴边
            return maxValue > 100 ? Math.ceil(maxValue * 1.1) : 100;
          },
          title: {
            display: true,
            text: '完成进度 (%)' // y轴标题
          },
          ticks: {
            // 自定义y轴刻度（显示百分比符号）
            callback: (value) => `${value}%`
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)' // 网格线样式（淡灰色，不干扰视觉）
          }
        },
        x: {
          title: {
            display: true,
            text: '月份' // x轴标题
          },
          grid: {
            display: false // 隐藏x轴网格线
          }
        }
      },
      // 交互配置（鼠标hover体验）
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      // 动画配置（加载时的过渡动画）
      animation: {
        duration: 1500, // 动画时长（1.5秒）
        easing: 'easeOutQuart' // 动画曲线（先快后慢，更自然）
      }
    }
  })
}

// 8. 生命周期钩子
onMounted(async () => {
  // 组件挂载后，先请求数据，再渲染图表
  await fetchChartData()
  createOrUpdateChart()
})

// 9. 监听图表数据变化，自动更新图表
watch(chartData, createOrUpdateChart, { deep: true })

// 10. 监听窗口 resize，自动调整图表尺寸
watch(
  () => window.innerWidth,
  () => chartInstance?.resize()
)

watch(searchKeyword, (keyword) => {
  if (!keyword) {
    // 无搜索词时显示全部数据
    createOrUpdateChart()
    return
  }
  const filteredDatasets = chartData.value.datasets.filter(dataset => 
    dataset.label.toLowerCase().includes(keyword.toLowerCase())
  )
  const tempData = { ...chartData.value, datasets: filteredDatasets };
  // 销毁旧实例并创建新图表
  if (chartInstance) chartInstance.destroy();
  const ctx = chartRef.value.getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: tempData,
    options: {
      // 响应式配置（适配不同屏幕尺寸）
      responsive: true,
      maintainAspectRatio: false, // 禁用固定宽高比，让图表填充满容器
      plugins: {
        // 图例配置（项目太多，支持滚动）
        legend: {
          position: 'bottom', // 图例放右侧（避免顶部拥挤）
          labels: {
            boxWidth: 12, // 图例前小方块尺寸
            usePointStyle: true, // 用圆点代替方块
            pointStyle: 'circle',
            maxHeight: 400, // 图例最大高度
            overflow: 'auto' // 超出高度时滚动
          },
        },
        // 提示框配置（鼠标悬浮显示详情）
        tooltip: {
          mode: 'index', // 显示同一x轴位置的所有数据集数据
          intersect: false, // 不要求鼠标精准 hover 到数据点
          callbacks: {
            // 自定义提示框内容（显示项目名 + 进度百分比）
            label: (context) => `${context.dataset.label}: ${context.parsed.y || 0}%`
          }
        },
        // 标题配置（图表顶部标题）
        title: {
          display: true,
          text: '各项目进度趋势图（1-9月）',
          font: { size: 16, weight: 'bold' },
          padding: { bottom: 30 }
        }
      },
      // 坐标轴配置
      scales: {
        y: {
          beginAtZero: true, // y轴从0开始
          // max: 100, // y轴最大值（进度百分比，最大100）
          max: (context) => {
            // 获取所有数据集的最大值
            const allValues = context.chart.data.datasets.flatMap(dataset => dataset.data);
            const maxValue = Math.max(...allValues);
            // 最大值基础上增加10%作为缓冲，确保数据点不贴边
            return maxValue >= 100 ? Math.ceil(maxValue * 1.1) : 100;
          },
          title: {
            display: true,
            text: '完成进度 (%)' // y轴标题
          },
          ticks: {
            // 自定义y轴刻度（显示百分比符号）
            callback: (value) => `${value}%`
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)' // 网格线样式（淡灰色，不干扰视觉）
          }
        },
        x: {
          title: {
            display: true,
            text: '月份' // x轴标题
          },
          grid: {
            display: false // 隐藏x轴网格线
          }
        }
      },
      // 交互配置（鼠标hover体验）
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      // 动画配置（加载时的过渡动画）
      animation: {
        duration: 1500, // 动画时长（1.5秒）
        easing: 'easeOutQuart' // 动画曲线（先快后慢，更自然）
      }
    }
  });
})

// 11. 组件卸载时清理（避免内存泄漏）
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>

<style scoped>
.progress-chart {
  width: 100%;
  height: 500px; /* 固定图表高度（根据需求调整） */
  position: relative;
  padding: 20px;
  box-sizing: border-box;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background: #fff;
}

/* 加载状态样式 */
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 12px;
  color: #666;
  font-size: 14px;
}
.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #eee;
  border-top-color: #165DFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 错误状态样式 */
.error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ff4d4f;
  font-size: 14px;
  padding: 16px;
  background: rgba(255, 77, 79, 0.05);
  border-radius: 8px;
}

/* 无数据状态样式 */
.empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #999;
  font-size: 14px;
}

.canvas-container {
  position: relative;
  height: 100%;
}

.search-input {
  position: absolute;
  top: -80px;
  left: 100px;
  width: 150px;
}
</style>