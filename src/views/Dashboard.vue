<template>
  <div class="dashboard-container">
    <!-- 页面标题和筛选器 -->
    <div class="dashboard-header">
      <div>
        <h1 class="page-title">研发项目进度与工时总览</h1>
        <p class="page-description">
          实时监控项目进度、里程碑完成情况和团队工时分配 | 最后更新: {{ lastUpdateTime }}
        </p>
      </div>
      
      <div class="filter-group">
        <el-select v-model="projectFilter" placeholder="所有项目" size="small" class="mr-2">
          <el-option label="所有项目" value="all"></el-option>
          <el-option label="产品A" value="productA"></el-option>
          <el-option label="产品B" value="productB"></el-option>
          <el-option label="产品C" value="productC"></el-option>
          <el-option label="基础平台" value="platform"></el-option>
        </el-select>
        
        <el-select v-model="teamFilter" placeholder="所有团队" size="small" class="mr-2">
          <el-option label="所有团队" value="all"></el-option>
          <el-option label="前端团队" value="frontend"></el-option>
          <el-option label="后端团队" value="backend"></el-option>
          <el-option label="测试团队" value="testing"></el-option>
          <el-option label="数据团队" value="data"></el-option>
        </el-select>
        
        <el-button type="primary" size="small" class="export-btn">
          <el-icon :size="16" class="mr-1"><Download /></el-icon>
          导出报表
        </el-button>
      </div>
    </div>
    
    <!-- 核心指标卡片 -->
    <el-row :gutter="16" class="metrics-row mb-4">
      <el-col :span="4" :xs="12" :sm="8" :md="6" :lg="4">
        <MetricCard 
          title="总项目数" 
          :value=totalCount 
          :icon="Folder" 
          icon-color="#165DFF"
          trend="increase"
          trend-text="2个新项目"
        />
      </el-col>
      <el-col :span="4" :xs="12" :sm="8" :md="6" :lg="4">
        <MetricCard 
          title="进行中项目" 
          value="8" 
          :icon="Loading" 
          icon-color="#FF7D00"
          trend="normal"
          trend-text="2个延期"
        />
      </el-col>
      <el-col :span="4" :xs="12" :sm="8" :md="6" :lg="4">
        <MetricCard 
          title="已完成项目" 
          value="4" 
          :icon="Check" 
          icon-color="#00B42A"
          trend="increase"
          trend-text="按时完成率85%"
        />
      </el-col>
      <el-col :span="4" :xs="12" :sm="8" :md="6" :lg="4">
        <MetricCard 
          title="总工时(人天)" 
          value="486" 
          :icon="Clock" 
          icon-color="#722ED1"
          trend="normal"
          trend-text="本月124人天"
        />
      </el-col>
      <el-col :span="4" :xs="12" :sm="8" :md="6" :lg="4">
        <MetricCard 
          title="完成里程碑" 
          value="23/36" 
          :icon="Flag" 
          icon-color="#165DFF"
          trend="increase"
          trend-text="完成率64%"
        />
      </el-col>
      <el-col :span="4" :xs="12" :sm="8" :md="6" :lg="4">
        <MetricCard 
          title="团队成员" 
          :value=teamMembers 
          :icon="User" 
          icon-color="#165DFF"
          trend="normal"
          trend-text="4个团队"
        />
      </el-col>
    </el-row>
    
    <!-- 项目进度趋势与工时排名 -->
    <el-row :gutter="16" class="mb-4">
      <el-col :span="16" :xs="24" :md="16">
        <el-card :border="false" class="chart-card">
          <div class="card-header">
            <h3 class="card-title">项目进度趋势</h3>
            <el-radio-group v-model="progressChartType" size="small">
              <el-radio-button label="progress">项目进度</el-radio-button>
              <el-radio-button label="hours">工时消耗</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-container">
            <ProjectProgressChart />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" :xs="24" :md="8">
        <el-card :border="false" class="ranking-card">
          <div class="card-header">
            <h3 class="card-title">员工工时排名</h3>
            <el-select v-model="rankingTimeRange" size="small">
              <el-option label="本月" value="month"></el-option>
              <el-option label="上月" value="lastMonth"></el-option>
              <el-option label="本季度" value="quarter"></el-option>
              <el-option label="本年度" value="year"></el-option>
            </el-select>
          </div>
          <div class="ranking-list">
            <RankingItem 
              v-for="(item, index) in employeeRanking" 
              :key="index" 
              :rank="index + 1"
              :name="item.name"
              :team="item.team"
              :hours="item.hours"
              :trend="item.trend"
              :trend-value="item.trendValue"
              :avatar="item.avatar"
            />
          </div>
          <div class="view-more">
            <el-button type="text" class="view-more-btn">
              查看完整排名 <el-icon :size="14"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 项目工时分布与团队工时对比 -->
    <el-row :gutter="16" class="mb-4">
      <el-col :span="12" :xs="24" :md="12">
        <el-card :border="false" class="chart-card">
          <div class="card-header">
            <h3 class="card-title">项目工时分布</h3>
          </div>
          <div class="chart-container">
            <ProjectHoursDistribution />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" :xs="24" :md="12">
        <el-card :border="false" class="chart-card">
          <div class="card-header">
            <h3 class="card-title">团队工时对比</h3>
          </div>
          <div class="chart-container">
            <TeamHoursComparison />
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 项目详情与员工统计 -->
    <el-row :gutter="16" class="mb-4">
      <el-col :span="10" :xs="24" :md="10">
        <el-card :border="false" class="timeline-card">
          <ProjectTimeline :project="projectFilter !== 'all' ? projectFilter : 'productA'" />
        </el-card>
      </el-col>
      <el-col :span="14" :xs="24" :md="14">
        <el-card :border="false" class="table-card">
          <div class="card-header">
            <h3 class="card-title">员工进度与工时统计</h3>
          </div>
          <EmployeeStatsTable ref="statsTableRef" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, onUnmounted } from 'vue'
import { 
  Folder, Check, Clock, Flag, User, 
  Download, ArrowRight, Loading
} from '@element-plus/icons-vue'

// 组件导入
import MetricCard from '../components/dashboard/MetricCard.vue'
import ProjectProgressChart from '../components/dashboard/ProjectProgressChart.vue'
import RankingItem from '../components/dashboard/RankingItem.vue'
import ProjectHoursDistribution from '../components/dashboard/ProjectHoursDistribution.vue'
import TeamHoursComparison from '../components/dashboard/TeamHoursComparison.vue'
import ProjectTimeline from '../components/dashboard/ProjectTimeline.vue'
import EmployeeStatsTable from '../components/dashboard/EmployeeStatsTable.vue'

import { useProjectStore } from '@/store'
import { storeToRefs } from 'pinia'

const projectStore = useProjectStore()
const { totalCount, teamMembers } = storeToRefs(projectStore)
const { getList, getTeamMembers } = projectStore

// 状态
const projectFilter = ref('all')
const teamFilter = ref('all')
const progressChartType = ref('progress')
const rankingTimeRange = ref('month')
const lastUpdateTime = ref('')
const statsTableRef = ref(null)
const loadingStatus = reactive({
  mainData: false,
  chartData: false
})

// 员工工时排名数据
const employeeRanking = ref([
  {
    name: '王华',
    team: '前端团队',
    hours: '22.3天',
    trend: 'increase',
    trendValue: '12.6%',
    avatar: 'https://picsum.photos/id/1027/200/200'
  },
  {
    name: '张伟',
    team: '后端团队',
    hours: '20.5天',
    trend: 'increase',
    trendValue: '34.0%',
    avatar: 'https://picsum.photos/id/1025/200/200'
  },
  {
    name: '李明',
    team: '后端团队',
    hours: '18.5天',
    trend: 'increase',
    trendValue: '14.2%',
    avatar: 'https://picsum.photos/id/1012/200/200'
  },
  {
    name: '刘芳',
    team: '测试团队',
    hours: '16.8天',
    trend: 'decrease',
    trendValue: '4.0%',
    avatar: 'https://picsum.photos/id/1066/200/200'
  },
  {
    name: '赵强',
    team: '数据团队',
    hours: '14.2天',
    trend: 'decrease',
    trendValue: '24.1%',
    avatar: 'https://picsum.photos/id/1074/200/200'
  }
])

// 格式化时间
const formatDateTime = () => {
  const date = new Date()
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(/\//g, '-')
}

// 刷新数据
const refreshAllData = async () => {
  loadingStatus.mainData = true
  
  try {
    // 刷新主数据
    await Promise.all([
      getList(),
      getTeamMembers()
    ])
    
    // 刷新表格数据
    if (statsTableRef.value) {
      statsTableRef.value.refreshData()
    }
    
    // 更新最后更新时间
    lastUpdateTime.value = formatDateTime()
  } catch (error) {
    console.error('数据刷新失败:', error)
  } finally {
    loadingStatus.mainData = false
  }
}

// 初始加载
onMounted(() => {
  refreshAllData()
  
  // 监听父组件的刷新事件（来自MainLayout）
  window.addEventListener('refreshDashboard', refreshAllData)
})

// 清理事件监听
onUnmounted(() => {
  window.removeEventListener('refreshDashboard', refreshAllData)
})
</script>

<style scoped>
/* 原有样式保持不变 */
.dashboard-container {
  width: 100%;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}

.page-description {
  color: #86909c;
  font-size: 14px;
}

.filter-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.metrics-row {
  margin-top: 10px;
}

.chart-card, .ranking-card, .timeline-card, .table-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f2f3f5;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.chart-container {
  padding: 20px;
  height: 320px;
}

.ranking-list {
  padding: 10px 20px;
}

.view-more {
  text-align: center;
  padding: 10px 0;
  border-top: 1px solid #f2f3f5;
}

.view-more-btn {
  color: #165dff;
  font-size: 14px;
  padding: 5px 0;
}

.export-btn {
  display: flex;
  align-items: center;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-group {
    margin-top: 10px;
    width: 100%;
  }
  
  .chart-container {
    height: 250px;
  }
}
</style>