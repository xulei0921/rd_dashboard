<template>
  <div class="employee-stats-table">
    <el-table 
      :data="tableData" 
      border 
      stripe 
      :header-cell-style="{ 'background-color': '#f5f7fa' }"
      v-loading="loading"
    >
      <el-table-column 
        prop="name" 
        label="员工姓名" 
        width="120"
      >
        <template #default="scope">
          <div class="employee-info">
            <el-avatar class="avatar" size="small">
              <img :src="scope.row.avatar" :alt="scope.row.name">
            </el-avatar>
            <span class="ml-2">{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="team" label="所属团队" width="120"></el-table-column>
      <el-table-column prop="project" label="负责项目" width="120"></el-table-column>
      <el-table-column prop="progress" label="任务进度" width="160">
        <template #default="scope">
          <div class="progress-container">
            <el-progress 
              :percentage="scope.row.progress" 
              stroke-width="6"
              :stroke-color="getProgressColor(scope.row.progress)"
            ></el-progress>
            <span class="progress-text">{{ scope.row.progress }}%</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="hours" label="本月工时(天)" width="130"></el-table-column>
      <el-table-column prop="overtime" label="加班工时(天)" width="130"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag 
            :type="scope.row.status === 'onTime' ? 'success' : (scope.row.status === 'delayed' ? 'danger' : 'warning')"
            size="small"
          >
            {{ scope.row.status === 'onTime' ? '正常' : (scope.row.status === 'delayed' ? '延期' : '风险') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default>
          <el-button type="text" size="small" class="view-details">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="table-pagination">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
        :page-size="pageSize"
        :page-sizes="[5, 10, 20]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 状态
const loading = ref(false)
const pageSize = ref(5)
const currentPage = ref(1)

// 表格数据
const tableData = ref([
  {
    name: '王华',
    avatar: 'https://picsum.photos/id/1027/200/200',
    team: '前端团队',
    project: '产品A',
    progress: 75,
    hours: 22.3,
    overtime: 3.5,
    status: 'onTime'
  },
  {
    name: '张伟',
    avatar: 'https://picsum.photos/id/1025/200/200',
    team: '后端团队',
    project: '产品B',
    progress: 60,
    hours: 20.5,
    overtime: 2.0,
    status: 'risk'
  },
  {
    name: '李明',
    avatar: 'https://picsum.photos/id/1012/200/200',
    team: '后端团队',
    project: '产品A',
    progress: 45,
    hours: 18.5,
    overtime: 1.5,
    status: 'delayed'
  },
  {
    name: '刘芳',
    avatar: 'https://picsum.photos/id/1066/200/200',
    team: '测试团队',
    project: '产品C',
    progress: 90,
    hours: 16.8,
    overtime: 0,
    status: 'onTime'
  },
  {
    name: '赵强',
    avatar: 'https://picsum.photos/id/1074/200/200',
    team: '数据团队',
    project: '基础平台',
    progress: 65,
    hours: 14.2,
    overtime: 0.5,
    status: 'risk'
  },
  {
    name: '孙丽',
    avatar: 'https://picsum.photos/id/1005/200/200',
    team: '前端团队',
    project: '产品B',
    progress: 80,
    hours: 19.7,
    overtime: 2.2,
    status: 'onTime'
  },
  {
    name: '周杰',
    avatar: 'https://picsum.photos/id/1010/200/200',
    team: '测试团队',
    project: '产品A',
    progress: 50,
    hours: 15.3,
    overtime: 1.0,
    status: 'delayed'
  }
])

// 分页数据
const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  return tableData.value.slice(startIndex, startIndex + pageSize.value)
})

// 进度条颜色
const getProgressColor = (progress) => {
  if (progress < 30) return '#f53f3f'
  if (progress < 70) return '#ff7d00'
  return '#00b42a'
}

// 分页事件
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 刷新数据方法
const refreshData = () => {
  loading.value = true
  // 模拟API请求延迟
  setTimeout(() => {
    loading.value = false
  }, 800)
}

// 暴露刷新方法供父组件调用
defineExpose({
  refreshData
})
</script>

<style scoped>
.employee-stats-table {
  width: 100%;
}

.employee-info {
  display: flex;
  align-items: center;
}

.progress-container {
  position: relative;
  padding-right: 50px;
}

.progress-text {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: 500;
}

.table-pagination {
  margin-top: 15px;
  text-align: right;
}

.view-details {
  color: #165dff;
  padding: 0;
}
</style>