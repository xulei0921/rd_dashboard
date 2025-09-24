
<template>
  <div class="ranking-item" :class="rankClass">
    <div class="rank-number">{{ rank }}</div>
    <el-avatar class="avatar">
      <img :src="avatar" :alt="name + '的头像'">
    </el-avatar>
    <div class="user-info">
      <div class="user-name">{{ name }}</div>
      <div class="user-team">{{ team }}</div>
    </div>
    <div class="user-hours">
      <div class="hours-value">{{ hours }}</div>
      <div class="hours-trend" :class="trendClass">
        <el-icon :size="12" class="mr-0.5">
          <component :is="trendIcon" />
        </el-icon>
        {{ trendValue }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { ArrowUp, ArrowDown, CaretTop, CaretBottom } from '@element-plus/icons-vue'

const props = defineProps({
  rank: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  team: {
    type: String,
    required: true
  },
  hours: {
    type: String,
    required: true
  },
  trend: {
    type: String,
    required: true // increase, decrease
  },
  trendValue: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  }
})

// 计算排名样式类
const rankClass = computed(() => {
  if (props.rank === 1) return 'rank-1'
  if (props.rank === 2) return 'rank-2'
  if (props.rank === 3) return 'rank-3'
  return 'rank-common'
})

// 计算趋势图标
const trendIcon = computed(() => {
  return props.trend === 'increase' ? CaretTop : CaretBottom
})

// 计算趋势样式
const trendClass = computed(() => {
  return props.trend === 'increase' ? 'text-success' : 'text-danger'
})
</script>

<style scoped>
.ranking-item {
  display: flex;
  align-items: center;
  padding: 12px 10px;
  border-radius: 6px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.ranking-item:hover {
  background-color: #f5f7fa;
}

.rank-1 {
  background-color: #fffbe6;
  border: 1px solid rgb(208, 189, 102);
}

.rank-1:hover {
  background-color: #f7efcb;
}


.rank-2 {
  background-color: #F9FAFB;
  border: 1px solid #e5e6eb;
}

.rank-2:hover {
  background-color: #eff5fb;
}

.rank-3 {
  background-color: #fff2e8;
  border: 1px solid #ffd8bf;
}

.rank-3:hover {
  background-color: #fbe7d9;
}

.rank-common {
  border: 1px solid #F3F4F6;
}

.rank-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  margin-right: 12px;
  background-color: #F3F4F6;
}

.rank-1 .rank-number {
  background-color: #ffe880;
  color: #d48806;
}

.rank-2 .rank-number {
  background-color: #F3F4F6;
  color: #86909c;
}

.rank-3 .rank-number {
  background-color: #ffd8bf;
  color: #e67700;
}

.avatar {
  width: 36px;
  height: 36px;
  margin-right: 12px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
}

.user-team {
  font-size: 12px;
  color: #86909c;
  margin-top: 2px;
}

.user-hours {
  text-align: right;
}

.hours-value {
  font-size: 16px;
  font-weight: bold;
}

.hours-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 2px;
}

.text-success {
  color: #00b42a;
}

.text-danger {
  color: #f53f3f;
}
</style>
