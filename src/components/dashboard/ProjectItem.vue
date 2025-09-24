<template>
  <div class="project-item">
    <!-- 项目头部：名称、负责人、时间、进度条等 -->
    <div class="project-header">
      <div class="project-info">
        <el-icon :size="25">
            <component :is="Menu" />
        </el-icon>
        <span class="project-name">{{ project.projectName }}</span>
        <span class="project-meta">负责人: {{ project.projectManager }} | 周期: {{ project.startDate }}~{{ project.endDate }} | 共 {{ project.milestoneCount }} 个里程碑</span>
      </div>
      <div class="project-stats">
        <span>总进度 {{ project.totalProgress.toFixed(0) }}%</span>
        <span>工时 {{ project.totalConsumed.toFixed(0) }}人天</span>
        <span :class="project.projectStatus === 'doing' ? 'status-normal' : 'status-delay'">
          {{ project.projectStatus }}
        </span>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: project.totalProgress + '%' }"
        :class="{ 'progress-blue': project.projectStatus === 'delayed', 'progress-green': project.projectStatus === 'doing' }"
      ></div>
    </div>

    <!-- 里程碑阶段列表 -->
    <div class="stages-list">
      <div 
        v-for="(stage, index) in project.tasks" 
        :key="index" 
        class="stage-item"
        :class="{ 
          'stage-done': stage.isDone, 
        //   'stage-in-progress': !stage.isDone && index === project.stages.findIndex(s => !s.isDone),
        //   'stage-pending': !stage.isDone && index > project.stages.findIndex(s => !s.isDone)
        }"
      >
        <!-- 状态图标（已完成/进行中/待开始） -->
        <span class="stage-icon">
          <!-- <svg v-if="stage.isDone" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <svg v-else-if="index === project.stages.findIndex(s => !s.isDone)" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6h4l-4 4v-6H8l4-4z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
          </svg> -->
        </span>
        <div class="stage-content">
          <div class="stage-name">{{ stage.name }}</div>
          <div class="stage-desc">{{ stage.desc }}</div>
        </div>
        <div class="stage-date">
          <div>开始日期: {{ stage.startDate }}</div>    
          <div :class="stage.isDone ? 'actual-done' : 'actual-pending'">
            {{ stage.isDone ? '实际: ' + stage.actualDate : stage.status }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Menu } from '@element-plus/icons-vue'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
/* 项目卡片样式 */
.project-item {
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

/* 项目头部 */
.project-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.project-name {
  font-weight: bold;
  font-size: 16px;
}
.project-meta {
  display: flex;
  font-size: 14px;
  color: #666;
}
.project-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
}
.status-normal {
  color: green;
}
.status-delay {
  color: orange;
}

/* 进度条 */
.progress-bar {
  height: 8px;
  background: #eee;
  border-radius: 4px;
  margin-bottom: 16px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}
.progress-blue {
  background: #4285f4;
}
.progress-green {
  background: #34a853;
}

/* 里程碑阶段 */
.stages-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.stage-item {
  display: flex;
  align-items: flex-start;
  padding: 18px;
  margin-left: 40px;
  margin-top: 20px;
  border-radius: 4px;
  border: 1px solid black;
}
.stage-done {
  background: #e6f7ed;
}
.stage-in-progress {
  background: #e6f4ff;
}
.stage-pending {
  background: #f5f5f5;
}
.stage-icon {
  margin-right: 8px;
  font-size: 16px;
}
.stage-content {
  flex: 1;
}
.stage-name {
  font-weight: 500;
}
.stage-desc {
  font-size: 12px;
  color: #666;
}
.stage-date {
  text-align: right;
  font-size: 12px;
}
.actual-done {
  color: green;
}
.actual-pending {
  color: orange;
}
</style>