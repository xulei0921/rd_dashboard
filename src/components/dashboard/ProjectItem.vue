<template>
  <div class="project-timeline">
    <!-- 项目头部信息 -->
    <div class="project-header">
      <div class="project-info">
        <h3 class="project-title">{{ currentProject?.projectName || '项目详情' }}</h3>
        <div class="project-meta">
          <span class="meta-item">
            <User class="icon" />
            项目负责人: {{ currentProject?.projectManager || '未知' }}
          </span>
          <span class="meta-item">
            <Calendar class="icon" />
            开始日期: {{ formatDate(currentProject?.startDate) }}
          </span>
          <span class="meta-item">
            <Clock class="icon" />
            结束日期: {{ currentProject?.endDate || '未设置' }}
          </span>
          <span class="meta-item">
            <Flag class="icon" />
            里程碑总数: {{ currentProject?.milestoneCount || 0 }}
          </span>
          <span class="meta-item">
            <Timer class="icon" />
            已消耗工时: {{ currentProject?.totalConsumed || 0 }}小时
          </span>
        </div>
      </div>
      
      <!-- 项目状态标签 -->
      <el-tag 
        :type="getStatusType(currentProject?.projectStatus)"
        size="large"
        class="status-tag"
      >
        {{ getStatusText(currentProject?.projectStatus) }}

        <span class="meta-item-switch">
          <el-switch
            v-model="isShowMilestone"
            inactive-text="显示项目里程碑"
          />
        </span>
      </el-tag>
    </div>
    
    <!-- 总体进度条 -->
    <div class="progress-overview">
      <div class="progress-info">
        <span>项目总进度</span>
        <!-- <span class="progress-value">{{ currentProject?.totalProgress.toFixed(1) || 0 }}%</span> -->
      </div>
      <el-progress
        :percentage="currentProject?.totalProgress.toFixed(1) || 0" 
        stroke-width="8"
        :color="getProgressColor(currentProject?.totalProgress || 0)"
      />
    </div>
    
    <!-- 项目任务时间线 -->
    <div class="timeline-header" v-if="isShowMilestone">
      <h4>项目任务里程碑</h4>
      <el-select 
        v-model="taskFilter" 
        size="small" 
        @change="handleFilterChange"
        class="filter-select"
      >
        <el-option label="全部任务" value="all"></el-option>
        <el-option label="已完成" value="done"></el-option>
        <el-option label="进行中" value="doing"></el-option>
        <el-option label="待开始" value="wait"></el-option>
        <el-option label="已延期" value="delayed"></el-option>
        <el-option label="已关闭" value="closed"></el-option>
      </el-select>
    </div>
    
    <div class="timeline-container" v-if="isShowMilestone" >
      <div class="timeline-line"></div>
      
      <div
        v-for="(task, index) in filteredTasks" 
        :key="index" 
        class="timeline-item"
        :class="`status-${task.status}`"
      >
        <div class="timeline-dot" :style="{ backgroundColor: getTaskStatusColor(task.status) }"></div>
        <div class="timeline-content">
          <div class="task-header">
            <div class="task-title">{{ task.name }}</div>
            <el-tag
              :type="getTaskStatusType(task.status)"
              size="small"
            >
              {{ getTaskStatusText(task.status) }}
            </el-tag>
          </div>
          
          <div class="task-dates">
            <span>
              <Clock class="date-icon" />
              开始: {{ task.startDate ? formatDate(task.startDate) : '未设置' }}
            </span>
            <span>
              <CircleCheck class="date-icon" />
              结束: {{ task.endDate ? formatDate(task.endDate) : '未设置' }}
            </span>
          </div>
          
          <!-- 任务持续时间计算 -->
          <div v-if="task.startDate && task.endDate && task.status !== 'wait'" class="task-duration">
            <Timer class="duration-icon" />
            持续时间: {{ calculateDuration(task.startDate, task.endDate) }}
          </div>
        </div>
      </div>
      
      <div v-if="filteredTasks.length === 0 && !isLoading" class="empty-state">
        <el-empty description="暂无任务数据" />
      </div>
      
      <div v-if="isLoading" class="loading-state">
        <el-loading indicator="加载中..." />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useProjectStore } from '@/store'
import { storeToRefs } from 'pinia'
import { 
  User, Calendar, Clock, Flag, Timer, CircleCheck
} from '@element-plus/icons-vue'

const projectStore = useProjectStore()
const { projectDetails } = storeToRefs(projectStore)
const { getProjectDetails } = projectStore

// 使用Props 从父组件接收数据
const props = defineProps({
  projectId: {
    type: Number,
    required: true
  }
})

// 状态管理
const isLoading = ref(true)
const taskFilter = ref('all')
const currentProject = ref(null)
// 控制项目里程碑的显示
const isShowMilestone = ref(false)

// 获取项目详情数据
const fetchProjectData = async () => {
  try {
    isLoading.value = true
    await getProjectDetails()
    // 从所有项目中根据父组件传的项目id筛选当前项目
    currentProject.value = projectDetails.value.find(
      project => project.id === props.projectId
    )
  } catch (error) {
    console.error('获取项目详情失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 筛选任务
const filteredTasks = computed(() => {
  // 如果当前项目没有里程碑，则返回一个空列表
  if (!currentProject.value?.tasks) return []
  
  return taskFilter.value === 'all'
    // 如果当前筛选条件是全部任务，全部返回
    ? currentProject.value.tasks
    // 否则筛选状态相同的任务
    : currentProject.value.tasks.filter(task => task.status === taskFilter.value)
})

// 处理筛选变化
const handleFilterChange = () => {
  // 滚动到时间线顶部
  document.querySelector('.timeline-container')?.scrollTo({ top: 0, behavior: 'smooth' })
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知'
  try {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm')
  } catch (e) {
    return dateString
  }
}

// 计算任务持续时间
const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return '未知'
  
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    // 计算毫秒差
    const diffMs = end - start
    // 转换为天数（向上取整）
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    
    return diffDays <= 1 
      ? `${Math.ceil(diffMs / (1000 * 60 * 60))}小时` 
      : `${diffDays}天`
  } catch (e) {
    return '计算错误'
  }
}

// 状态文本映射
const getStatusText = (status) => {
  // 状态映射表
  const statusMap = {
    'done': '已完成',
    'doing': '进行中',
    'wait': '待开始',
    'delayed': '已延期',
    'closed': '已关闭'
  }
  return statusMap[status] || '未知状态'
}

// 状态类型映射（用于el-tag）
const getStatusType = (status) => {
  const typeMap = {
    'done': 'success',
    'doing': 'primary',
    'wait': 'info',
    'delayed': 'error',
    'closed': 'warning'
  }
  return typeMap[status] || 'default'
}

// 任务状态相关方法
const getTaskStatusText = getStatusText
const getTaskStatusType = getStatusType

// 获取任务状态颜色
const getTaskStatusColor = (status) => {
  const colorMap = {
    'done': '#52c41a',
    'doing': '#1890ff',
    'wait': '#A9A9A9',
    'delayed': '#ff0000',
    'closed': '#faad14'
  }
  return colorMap[status] || '#8c8c8c'
}

// 获取进度条颜色
const getProgressColor = (progress) => {
  if (progress < 30) return '#ff4d4f'
  if (progress < 70) return '#faad14'
  return '#52c41a'
}

// 监听项目ID变化重新加载数据
watch(() => props.projectId, fetchProjectData)

// 初始加载
onMounted(fetchProjectData)
</script>

<style scoped>
.project-timeline {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

/* 项目头部样式 */
.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.project-info .project-title {
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2329;
}

.project-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
  color: #6b7280;
  font-size: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-item-switch {
  position: absolute;
  top: 32px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon {
  width: 16px;
  height: 16px;
}

.status-tag {
  position: relative;
  padding: 6px 12px;
  font-size: 14px;
}

/* 进度条样式 */
.progress-overview {
  margin-bottom: 30px;
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 6px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.progress-value {
  font-weight: 600;
  color: #1890ff;
}

/* 时间线头部 */
.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.timeline-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2329;
}

.filter-select {
  width: 140px;
}

/* 时间线容器 */
.timeline-container {
  position: relative;
  padding-left: 30px;
  margin-left: 10px;
}

.timeline-line {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #e5e7eb;
}

/* 时间线项样式 */
.timeline-item {
  position: relative;
  margin-bottom: 24px;
  padding-bottom: 8px;
}

.timeline-dot {
  position: absolute;
  left: -36px;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #1890ff;
  transition: all 0.3s ease;
}

.timeline-content {
  padding: 12px 16px;
  background-color: #f9fafb;
  border-radius: 6px;
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
}

.status-done .timeline-content {
  border-left-color: #52c41a;
}

.status-doing .timeline-content {
  border-left-color: #1890ff;
}

.status-wait .timeline-content {
  border-left-color: #A9A9A9;
}

.status-delayed .timeline-content {
  border-left-color: #ff0000
}

.status-closed .timeline-content {
  border-left-color: #faad14;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-title {
  font-weight: 500;
  color: #1f2329;
}

.task-dates {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
}

.date-icon, .duration-icon {
  width: 14px;
  height: 14px;
  margin-right: 4px;
}

.task-duration {
  font-size: 13px;
  color: #8c8c8c;
  display: flex;
  align-items: center;
}

/* 空状态和加载状态 */
.empty-state, .loading-state {
  padding: 40px 0;
  text-align: center;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .project-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .project-meta {
    gap: 12px;
  }
  
  .task-dates {
    flex-direction: column;
    gap: 4px;
  }
}
</style>