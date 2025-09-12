<template>
  <el-card class="metric-card" :border="false">
    <div class="metric-header">
      <span class="metric-title">{{ title }}</span>
      <el-icon :size="20" class="metric-icon" :style="{ color: iconColor }">
        <component :is="icon" />
      </el-icon>
    </div>
    <div class="metric-value">{{ value }}</div>
    <div class="metric-trend" :class="trendClass">
      <el-icon :size="14" class="mr-1">
        <component :is="trendIcon()" />
      </el-icon>
      <span>{{ trendText }}</span>
    </div>
  </el-card>
</template>

<script setup>
import { defineProps } from 'vue'
import { ArrowUp, ArrowDown, Check } from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  icon: {
    type: Object,
    required: true
  },
  iconColor: {
    type: String,
    default: '#165DFF'
  },
  trend: {
    type: String,
    default: 'increase', // increase, decrease, normal
  },
  trendText: {
    type: String,
    required: true
  }
})

const trendIcon = () => {
  switch (props.trend) {
    case 'increase':
      return ArrowUp
    case 'decrease':
      return ArrowDown
    case 'normal':
      return Check
    default:
      return ArrowUp
  }
}

const trendClass = () => {
  switch (props.trend) {
    case 'increase':
      return 'text-success'
    case 'decrease':
      return 'text-danger'
    case 'normal':
      return 'text-primary'
    default:
      return 'text-success'
  }
}
</script>

<style scoped>
.metric-card {
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  color: #86909c;
  font-size: 14px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 6px;
}

.metric-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.text-success {
  color: #00b42a;
}

.text-danger {
  color: #f53f3f;
}

.text-primary {
  color: #165dff;
}
</style>
