<template>
  <div class="project-timeline">
    <div class="timeline-header">
      <h3 class="timeline-title">{{ projectName }} 里程碑</h3>
      <el-select v-model="selectedProject" size="small" @change="handleProjectChange" style="width: 85px;">
        <el-option label="产品A" value="productA"></el-option>
        <el-option label="产品B" value="productB"></el-option>
        <el-option label="产品C" value="productC"></el-option>
        <el-option label="基础平台" value="platform"></el-option>
      </el-select>
    </div>
    
    <div class="timeline-container">
      <div class="timeline-line"></div>
      
      <div 
        v-for="(milestone, index) in filteredMilestones" 
        :key="index" 
        class="timeline-item"
        :class="{ 'completed': milestone.status === 'completed', 'current': milestone.status === 'current', 'upcoming': milestone.status === 'upcoming' }"
      >
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="milestone-title">{{ milestone.title }}</div>
          <div class="milestone-date">{{ milestone.date }}</div>
          <div class="milestone-desc">{{ milestone.description }}</div>
          <div class="milestone-status">
            <el-tag 
              :type="milestone.status === 'completed' ? 'success' : (milestone.status === 'current' ? 'primary' : 'info')"
              size="small"
            >
              {{ milestone.status === 'completed' ? '已完成' : (milestone.status === 'current' ? '进行中' : '待开始') }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '@/store'
import { storeToRefs } from 'pinia'

const projectStore = useProjectStore()

const { projectDeatils } = storeToRefs(projectStore)
const { getProjectDetails } = projectStore

const props = defineProps({
  project: {
    type: String,
    default: 'productA'
  }
})

const selectedProject = ref(props.project)
const projectName = computed(() => {
  const names = {
    'productA': '产品A',
    'productB': '产品B',
    'productC': '产品C',
    'platform': '基础平台'
  }
  return names[selectedProject.value] || '项目'
})

// 里程碑数据
const milestones = ref([
  {
    project: 'productA',
    title: '需求分析完成',
    date: '2023-01-15',
    description: '完成所有功能模块的需求分析和文档编写',
    status: 'completed'
  },
  {
    project: 'productA',
    title: '架构设计评审',
    date: '2023-02-20',
    description: '完成系统架构设计并通过技术评审',
    status: 'completed'
  },
  {
    project: 'productA',
    title: '核心功能开发',
    date: '2023-04-30',
    description: '完成核心模块的开发工作',
    status: 'current'
  },
  {
    project: 'productA',
    title: '系统测试',
    date: '2023-05-30',
    description: '完成系统集成测试和性能测试',
    status: 'upcoming'
  },
  {
    project: 'productA',
    title: '正式发布',
    date: '2023-06-30',
    description: '系统正式上线发布',
    status: 'upcoming'
  },
  // 其他项目里程碑...
  {
    project: 'productB',
    title: '项目启动',
    date: '2023-02-10',
    description: '项目正式启动，确定团队成员和分工',
    status: 'completed'
  },
  {
    project: 'productB',
    title: '原型设计',
    date: '2023-03-15',
    description: '完成产品原型设计并确认',
    status: 'completed'
  },
  {
    project: 'productB',
    title: '开发阶段',
    date: '2023-06-30',
    description: '完成所有功能模块的开发',
    status: 'current'
  },
  {
    project: 'productB',
    title: '用户验收',
    date: '2023-07-30',
    description: '完成用户验收测试',
    status: 'upcoming'
  }
])

// 筛选当前项目的里程碑
const filteredMilestones = computed(() => {
  return milestones.value
    .filter(m => m.project === selectedProject.value)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
})

const handleProjectChange = (value) => {
  selectedProject.value = value
}

onMounted(() => {
  getProjectDetails()
})
</script>

<style scoped>
.project-timeline {
  width: 100%;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.timeline-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.timeline-container {
  position: relative;
  padding-left: 24px;
}

.timeline-line {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #e5e7eb;
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
  padding-bottom: 8px;
}

.timeline-dot {
  position: absolute;
  left: -28px;
  top: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #e5e7eb;
}

.timeline-item.completed .timeline-dot {
  background-color: #00b42a;
  box-shadow: 0 0 0 3px rgba(0, 180, 42, 0.2);
}

.timeline-item.current .timeline-dot {
  background-color: #165dff;
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.2);
}

.timeline-item.upcoming .timeline-dot {
  background-color: #86909c;
}

.timeline-content {
  padding: 10px 15px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.milestone-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.milestone-date {
  font-size: 12px;
  color: #86909c;
  margin-bottom: 6px;
}

.milestone-desc {
  font-size: 13px;
  color: #4e5969;
  margin-bottom: 8px;
}

.milestone-status {
  display: inline-block;
}
</style>