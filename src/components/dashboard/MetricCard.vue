<template>
  <el-card class="metric-card" :border="false">
    <div class="metric-header">
      <span class="metric-title">{{ title }}</span>
      <el-icon :size="20" class="metric-icon" :style="{ color: iconColor, backgroundColor: iconBgColor }">
        <component :is="icon" />
      </el-icon>
    </div>
    <div class="metric-value">{{ value }}</div>
    <div class="metric-trend" :class="trendClass">
      <el-icon :size="14" class="mr-1">
        <component :is="trendIcon()" />
      </el-icon>
      <span style="margin-left: 2px;">{{ trendText }}</span>
    </div>
  </el-card>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import { ArrowUp, ArrowDown, Check, Top, Warning, CircleCheck, Clock, Flag, Avatar } from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
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
  iconBgColor:{
    type: String,
    default: '#E8F3FF'
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
      return Top
    case 'decrease':
      return ArrowDown
    case 'normal':
      return Check
    case 'warning':
      return Warning
    case 'CircleCheck':
      return CircleCheck
    case 'clock':
      return Clock
    case 'flag':
      return Flag
    case 'avatar':
      return Avatar
    default:
      return ArrowUp
  }
}

// const trendClass = () => {
//   switch (props.trend) {
//     case 'increase':
//       return 'text-success'
//     case 'decrease':
//       return 'text-danger'
//     case 'normal':
//       return 'text-primary'
//     default:
//       return 'text-success'
//   }
// }

const trendClass = computed(() => {
  switch (props.trend) {
    case 'increase':
      return 'text-success'
    case 'warning':
      return 'text-warning'
    case 'CircleCheck':
      return 'text-success'
    case 'clock':
      return 'text-primary'
    case 'flag':
      return 'text-success'
    case 'avatar':
      return 'text-group'
  }
})

</script>

<style scoped>
.metric-card {
  position: relative;
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

.metric-icon {
  position: absolute;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 18px;
}

.text-success {
  color: #00b42a;
}

.text-warning {
  color: #FF7D00;
}

.text-danger {
  color: #f53f3f;
}

.text-primary {
  color: #165DFF;
}

.text-group {
  color: #86909C;
}
</style>
