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
          :value=totalProjects 
          :icon="Folder" 
          icon-color="#165DFF"
          iconBgColor="#E8F3FF"
          trend="increase"
          :trend-text="`${newProjectCount}个新项目`"
        />
      </el-col>
      <el-col :span="4" :xs="12" :sm="8" :md="6" :lg="4">
        <MetricCard 
          title="进行中项目" 
          :value=ongoingProjCount 
          :icon="Loading" 
          icon-color="#FF7D00"
          iconBgColor="#FFF2E5"
          trend="warning"
          :trend-text="`${delayProjectCount}个延期`"
        />
      </el-col>
      <el-col :span="4" :xs="12" :sm="8" :md="6" :lg="4">
        <MetricCard 
          title="已完成项目" 
          :value=completedProjCount 
          :icon="Check" 
          icon-color="#00B42A"
          iconBgColor="#E5F7E9"
          trend="CircleCheck"
          trend-text="按时完成率85%"
        />
      </el-col>
      <el-col :span="4" :xs="12" :sm="8" :md="6" :lg="4">
        <MetricCard 
          title="总工时(人天)" 
          :value=totalManDaysCount
          :icon="Clock" 
          icon-color="#722ED1"
          iconBgColor="#F3E8FF"
          trend="clock"
          :trend-text="`${chRankingTimeRange}${currentWorkHours}小时`"
        />
      </el-col>
      <el-col :span="4" :xs="12" :sm="8" :md="6" :lg="4">
        <MetricCard 
          title="完成里程碑" 
          :value="`${totalCompletedTasks}/${totalTasks}`"
          :icon="Flag" 
          icon-color="#165DFF"
          trend="flag"
          :trend-text="`完成率${completionRate}%`"
        />
      </el-col>
      <el-col :span="4" :xs="12" :sm="8" :md="6" :lg="4">
        <MetricCard 
          title="团队成员" 
          :value=totalUserCount 
          :icon="User" 
          icon-color="#165DFF"
          trend="avatar"
          :trend-text="`${totalTeamCount}个团队`"
        />
      </el-col>
    </el-row>
    
    <!-- 项目进度趋势与工时排名 -->
    <el-row :gutter="16" class="mb-4" style="margin-top: 25px;">
      <el-col :span="16" :xs="24" :md="16">
        <el-card :border="false" class="chart-card">
          <div class="card-header">
            <h3 class="card-title" v-if="progressChartType == 'progress'">项目进度趋势</h3>
            <h3 class="card-title" v-else>项目工时消耗</h3>
            <el-radio-group v-model="progressChartType" size="small">
              <el-radio-button label="progress">项目进度</el-radio-button>
              <el-radio-button label="hours">工时消耗</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-container-1" v-if="progressChartType == 'progress'">
            <ProjectProgressChart />
          </div>
          <div class="chart-container-1" v-else>
            <ProjectHoursChart />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" :xs="24" :md="8">
        <el-card :border="false" class="ranking-card">
          <div class="card-header">
            <h3 class="card-title">员工工时排名</h3>
            <el-select v-model="rankingTimeRange" size="small" style="width: 70px;" @change="fetchEmployeeRanking">
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
            <el-button type="text" class="view-more-btn" @click="openFullRanking">
              查看完整排名 <el-icon :size="14"><ArrowRight /></el-icon>
            </el-button>
          </div>

          <FullRankingDialog
            v-model:visible="showFullRanking"
            :init-time-range="rankingTimeRange"
          />

        </el-card>
      </el-col>
    </el-row>
    
    <!-- 项目工时分布与团队工时对比 -->
    <el-row :gutter="16" class="mb-4" style="margin-top: 25px;">
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
    <!-- <el-row :gutter="16" class="mb-4" style="margin-top: 25px;">
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
    </el-row> -->

    <!-- 项目进度详情与里程碑 -->
    <el-row :gutter="16" class="mb-4" style="margin-top: 25px;">
      <el-col :span="24" :xs="24" :md="24">
        <el-card :border="false" class="timeline-card">
          <ProjectList
            :project-id="2"
          ></ProjectList>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script setup>
import { onMounted, ref, reactive, onUnmounted, watch } from 'vue'
import { 
  Folder, Check, Clock, Flag, User, 
  Download, ArrowRight, Loading, Top
} from '@element-plus/icons-vue'

// 组件导入
import MetricCard from '../components/dashboard/MetricCard.vue'
import ProjectProgressChart from '../components/dashboard/ProjectProgressChart.vue'
import RankingItem from '../components/dashboard/RankingItem.vue'
import ProjectHoursDistribution from '../components/dashboard/ProjectHoursDistribution.vue'
import TeamHoursComparison from '../components/dashboard/TeamHoursComparison.vue'
import ProjectTimeline from '../components/dashboard/ProjectTimeline.vue'
import EmployeeStatsTable from '../components/dashboard/EmployeeStatsTable.vue'
import FullRankingDialog from '@/components/dashboard/FullRankingDialog.vue'
import ProjectHoursChart from '@/components/dashboard/ProjectHoursChart.vue'
import ProjectList from '@/components/dashboard/ProjectList.vue'

import { useProjectStore, useEmployeeWorkHoursStore, useAppStore, useTeamStore } from '@/store'
import { storeToRefs } from 'pinia'

const projectStore = useProjectStore()
const workHourStore = useEmployeeWorkHoursStore()
const appStore = useAppStore()
const teamStore = useTeamStore()

const { 
        totalProjects,
        totalUserCount,
        totalTeamCount,
        ongoingProjCount, 
        completedProjCount,
        totalManDaysCount,
        completionRate,
        totalTasks,
        totalCompletedTasks,
        newProjectCount,
        delayProjectCount
      } = storeToRefs(projectStore)

const { 
        getTotalProjects, 
        getTotalUserCount, 
        getOngoingProjectsCount, 
        getCompletedProjCount ,
        getTotalManDaysCount,
        getCompMilestonesCount,
        getNewProjectCount,
        getDelayProjectCount
      } = projectStore

const {
        getTeamWorkHoursComparison
      } = teamStore
  
const {
        employeeRanking,
        loading,
        currentWorkHours
      } = storeToRefs(workHourStore)

const {
        fetchEmployeeRanking
      } = workHourStore
  
// 状态
const projectFilter = ref('all')
const teamFilter = ref('all')
const progressChartType = ref('progress')
const rankingTimeRange = ref('month')
const lastUpdateTime = ref('2025/9/14')
const statsTableRef = ref(null)
const isViewMore = ref(false)
const chRankingTimeRange = ref('')
const loadingStatus = reactive({
  mainData: false,
  chartData: false
})

// 控制弹窗显示
const showFullRanking = ref(false)

// 打开弹窗
const openFullRanking = () => {
  showFullRanking.value = true
}

watch(rankingTimeRange, (newVal) => {
  fetchEmployeeRanking(newVal);
  switch(newVal){
    case "month":
      chRankingTimeRange.value = "本月"
      break
    case "lastMonth":
      chRankingTimeRange.value = "上月"
      break
    case "quarter":
      chRankingTimeRange.value = "本季度"
      break
    case "year":
      chRankingTimeRange.value = "本年度"
      break
  }
}, { immediate: true }); // immediate: true 确保初始加载

watch(
  () => appStore.refreshTrigger,
  () => {
    refreshAllData() // 状态变化时执行刷新
  }
)

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
      getTotalProjects(),
      getTotalUserCount(),
      getOngoingProjectsCount(),
      getCompletedProjCount(),
      getTotalManDaysCount(),
      fetchEmployeeRanking(),
      getCompMilestonesCount(),
      getTeamWorkHoursComparison(),
      getNewProjectCount(),
      getDelayProjectCount()
    ])
    
    // 刷新表格数据
    if (statsTableRef.value) {
      statsTableRef.value.refreshData()
    }
    
    // 更新最后更新时间
    lastUpdateTime.value = formatDateTime()
    // console.log(employeeRanking.value)
  } catch (error) {
    console.error('数据刷新失败:', error)
  } finally {
    loadingStatus.mainData = false
  }
}

setInterval(() => {
  refreshAllData()
  console.log('111')
}, 1800000)

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
.dashboard-container {
  width: 100%;
  padding: 0 110px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 30px;
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
  /* flex-wrap: wrap; */
  gap: 8px;
  width: 280px;
}

.metrics-row {
  margin-top: 10px;
}

.chart-card, .ranking-card, .timeline-card, .table-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  overflow: hidden;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f2f3f5;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.chart-container {
  overflow: auto;
  padding: 20px;
  height: 500px;
}

.chart-container-1 {
  padding: 20px;
  height: 500px;
}

.ranking-list {
  overflow: hidden;
  height: 500px;
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

.timeline-card {
  /* height: 475px; */
  height: 820px;
  overflow: auto;
}

.bottom-gradient-shadow {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60px;

  background: linear-gradient(
    to top,
    rgba(0,0,0,0.15)
    transparent
  );

  pointer-events: none;
  z-index: 10;
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