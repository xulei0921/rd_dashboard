<template>
  <div class="employee-stats-table">
    <el-table 
      :data="paginatedData" 
      border 
      stripe
      style="width: 100%;"
      :header-cell-style="{ 'background-color': '#f5f7fa' }"
      v-loading="loading"
      empty-text="暂无数据"
    >
      <el-table-column 
        prop="name" 
        label="员工姓名" 
    
        fixed
      >
        <template #default="scope">
          <div class="employee-info">
            <!-- <el-avatar class="avatar" size="small">
              <img :src="scope.row.avatar" :alt="scope.row.name">
            </el-avatar> -->
            <span class="ml-2">{{ scope.row.userName || '未知人员'}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="roles" label="所属团队">
        <template #default="scope">
          <div class="employee-info" v-for="item in (scope.row.roles || ['未分配团队'])" v-if="scope.row.roles.length != 0">
            <span class="ml-2">{{ item }}</span>
          </div>
          <div class="employee-info" v-else>
            <span class="ml-2">未分配团队</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="projectNames" label="负责项目" >
        <template #default="scope">
          <div class="employee-info" v-for="item in scope.row.projectNames" v-if="scope.row.projectNames.length != 0">
            <span class="ml-2">{{ item }}</span>
          </div>
          <div class="employee-info" v-else>
            <span class="ml-2">暂无负责项目</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="completionRate" label="任务进度" >
        <template #default="scope">
          <div class="progress-container">
            <el-progress 
              :percentage="scope.row.completionRate" 
              stroke-width="6"
              :color="getProgressColor(scope.row.completionRate)"
            ></el-progress>
            <!-- <span class="progress-text">{{ scope.row.progress }}%</span> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="monthlyHours" label="本月工时(小时)"></el-table-column>
      <el-table-column prop="hourDeviation" label="工时偏差" ></el-table-column>
      <el-table-column prop="progressStatus" label="状态" >
        <template #default="scope">
          <el-tag 
            :type="scope.row.progressStatus === '正常' ? 'success' : (scope.row.progressStatus === '延期' ? 'danger' : 'warning')"
            size="small"
          >
            {{ scope.row.progressStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="100">
        <template #default>
          <el-button type="text" size="small" class="view-details">详情</el-button>
        </template>
      </el-table-column> -->
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
import { ref, computed, onMounted } from 'vue'
import { useEmployeeWorkHoursStore } from '@/store'
import { storeToRefs } from 'pinia'

const employeeWorkHoursStore = useEmployeeWorkHoursStore()

const {
        employeeData
      } = storeToRefs(employeeWorkHoursStore)

const {
        fetchEmployeeProgressList
      } = employeeWorkHoursStore

// 状态
const loading = ref(false)
const pageSize = ref(5)
const currentPage = ref(1)

// 表格数据
const tableData = ref([])

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

onMounted(async () => {
  await fetchEmployeeProgressList()
  tableData.value = employeeData.value
  // console.log(tableData)
})

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