<template>
  <el-dialog
    :model-value="visible"
    title="员工工时完整排名"
    :width="isMobile ? '90%' : '700px'"
    :before-close="handleClose"
    destroy-on-close
  >
    <!-- 筛选工具栏 -->
    <div class="filter-bar">
      <el-select
        v-model="timeRange"
        size="small"
        class="mr-2"
        @change="fetchEmployeeRanking"
      >
        <el-option label="本月" value="month"></el-option>
        <el-option label="上月" value="lastMonth"></el-option>
        <el-option label="本季度" value="quarter"></el-option>
        <el-option label="本年度" value="year"></el-option>
      </el-select>

      <el-select
        v-model="teamFilter"
        size="small"
        class="mr-2"
        @change="handleFilterChange"
      >
        <el-option label="所有团队" value="all"></el-option>
        <el-option label="研发" value="研发"></el-option>
        <!-- <el-option label="项目管理团队" value="项目管理团队"></el-option> -->
        <el-option label="测试" value="测试"></el-option>
        <el-option label="其他团队" value="其他团队"></el-option>
      </el-select>

      <el-input
        v-model="searchName"
        size="small"
        placeholder="搜索员工姓名"
        class="mr-2"
        clearable
        @input="handleSearch"
      />

      <el-button
        size="small"
        type="text"
        @click="toggleSort"
      >
        <el-icon :size="14" class="mr-1"><Sort /></el-icon>
        {{ sortAsc ? '工时升序' : '工时降序' }}
      </el-button>
    </div>

    <!-- 排名列表 -->
    <div class="ranking-container">
      <el-skeleton v-if="loading" :rows="8" :cols="1" class="skeleton-loading" />
      
      <div v-else-if="filteredList.length === 0" class="empty-state">
        <el-empty description="暂无符合条件的数据" />
      </div>
      
      <RankingItem
        v-else
        v-for="(item, index) in filteredList"
        :key="item.name"
        :rank="index + 1 + (currentPage - 1) * pageSize" 
        :name="item.name"
        :team="item.team"
        :hours="item.hours"
        :trend="item.trend"
        :trend-value="item.trendValue"
        :avatar="item.avatar"
      />
    </div>

    <!-- 分页 -->
    <template #footer>
      <el-pagination
        layout="total, prev, pager, next, sizes"
        :total="totalCount"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30]"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import RankingItem from './RankingItem.vue'
import { Sort } from '@element-plus/icons-vue'
import { useWindowSize } from '@vueuse/core'

import { useEmployeeWorkHoursStore } from '@/store'
import { storeToRefs } from 'pinia'
const employeeWorkHoursStore = useEmployeeWorkHoursStore()
const {
        employeeRanking,
        loading
      } = storeToRefs(employeeWorkHoursStore)

const {
        fetchEmployeeRanking
      } = employeeWorkHoursStore

// 响应式窗口尺寸（适配移动端）
const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

// 接收父组件参数
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  initTimeRange: {  // 初始时间范围（从父组件传入）
    type: String,
    default: 'month'
  }
})

// 对外暴露事件
const emit = defineEmits(['update:visible', 'close'])

// 状态管理
const timeRange = ref(props.initTimeRange)
const teamFilter = ref('all')
const searchName = ref('')
const sortAsc = ref(false)  // 排序方向：false-降序（默认）
// const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

// 原始数据（从store中获取）
const fullRankingList = employeeRanking
// 筛选后的总数据量
const totalCount = computed(() => filteredData.value.length)
// 筛选逻辑
const filteredData = computed(() => {
  let result = [...fullRankingList.value]
  
  // 团队筛选
  if (teamFilter.value !== 'all') {
    result = result.filter(item => item.team === teamFilter.value)
  }
  
  // 姓名搜索
  if (searchName.value) {
    const keyword = searchName.value.trim().toLowerCase()
    result = result.filter(item => 
      item.name.toLowerCase().includes(keyword)
    )
  }
  
  // 排序（按工时数值比较，处理"22.3小时"格式）
  return result.sort((a, b) => {
    const hoursA = parseFloat(a.hours) // 提取数字部分
    const hoursB = parseFloat(b.hours)
    return sortAsc.value ? hoursA - hoursB : hoursB - hoursA
  })
})

// 分页后的数据
const filteredList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})

// 事件处理，关闭弹窗后重置各筛选条件
const handleClose = () => {
  emit('update:visible', false)
  emit('close')
  teamFilter.value = 'all'  // 重置团队筛选
  searchName.value = ''  // 重置姓名搜索
  sortAsc.value = false  // 重置排序顺序
  currentPage.value = 1  // 重置页码
  pageSize.value = 10  // 重置页面显示数据条数
}

const handleFilterChange = () => {
  currentPage.value = 1  // 筛选条件变化时重置页码
}

const handleSearch = () => {
  currentPage.value = 1  // 搜索时重置页码
}

const toggleSort = () => {
  sortAsc.value = !sortAsc.value
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handlePageChange = (val) => {
  currentPage.value = val
}

// 监听初始时间范围变化（父组件修改时同步）
watch(() => props.initTimeRange, (newVal) => {
  timeRange.value = newVal
  fetchEmployeeRanking()
})

// 初始加载数据
fetchEmployeeRanking()

</script>

<style scoped>
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #f0f0f0;
}

.ranking-container {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

.skeleton-loading {
  width: 100%;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}
</style>