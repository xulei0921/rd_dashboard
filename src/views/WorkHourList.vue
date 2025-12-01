<template>
    <!-- 搜索表单 -->
    <el-form
        ref="form"
        :model="filterForm"
        :disabled="isLoading"
    >
        <el-row :gutter="20">
            <el-col>
                <el-form-item>
                    <h1 style="font-size: 22px;">员工工时记录</h1>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="姓名：">
                    <el-input placeholder="请输入姓名" v-model="filterForm.name" clearable @keyup.enter="handleSearch"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="年份：">
                    <el-date-picker
                        type="year"
                        style="width: 100%;"
                        v-model="filterForm.year"
                        value-format="YYYY"
                        placeholder="请选择年份"
                    ></el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="月份：">
                    <el-select v-model="filterForm.month" :empty-values="[null]">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="一月" value="01"></el-option>
                        <el-option label="二月" value="02"></el-option>
                        <el-option label="三月" value="03"></el-option>
                        <el-option label="四月" value="04"></el-option>
                        <el-option label="五月" value="05"></el-option>
                        <el-option label="六月" value="06"></el-option>
                        <el-option label="七月" value="07"></el-option>
                        <el-option label="八月" value="08"></el-option>
                        <el-option label="九月" value="09"></el-option>
                        <el-option label="十月" value="10"></el-option>
                        <el-option label="十一月" value="11"></el-option>
                        <el-option label="十二月" value="12"></el-option>
                    </el-select>
                    <!-- <el-date-picker
                        type="month"
                        placeholder="请选择月份"
                        v-model="filterForm.month"
                        format="MM月"
                        value-format="MM"
                        popper-class="due_month"
                    ></el-date-picker> -->
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="日期范围：">
                    <el-date-picker
                        v-model="dateRange"
                        type="daterange"
                        value-format="YYYY-MM-DD"
                        placeholder=""
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        style="width: 100%;"
                        @clear="handleClear"
                    ></el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="项目：">
                    <el-select v-model="filterForm.project" :empty-values="[null]">
                        <el-option label="全部" value=""></el-option>
                        <el-option
                            v-for="project in projectList"
                            :key="project"
                            :label="project"
                            :value="project"
                        />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="执行：">
                    <el-input placeholder="请输入执行名称" v-model="filterForm.execution" clearable @keyup.enter="handleSearch"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="任务：">
                    <el-input placeholder="请输入任务名称" v-model="filterForm.task" clearable @keyup.enter="handleSearch"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item style="float: right;">
            <el-button :icon="Upload" @click="handleExport">导出</el-button>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button type="info" plain :icon="RefreshRight" @click="handleReset">重置</el-button>
        </el-form-item>
    </el-form>

    <span class="work-hour">工时汇总: <strong>{{ workhourSummary || 0 }}</strong>小时</span>

    <!-- 工时表格 -->
    <el-table
        :data="tableData"
        v-loading="isLoading"
    >
        <el-table-column prop="account" label="账号" />
        <el-table-column prop="realname" label="姓名" />
        <el-table-column prop="projectName" label="项目名称" />
        <el-table-column prop="executionName" label="执行名称" show-overflow-tooltip />
        <el-table-column prop="taskName" label="任务名称" show-overflow-tooltip />
        <el-table-column prop="date" label="日期" />
        <el-table-column prop="consumed" label="消耗工时" />
        <el-table-column prop="begin" label="开始时间" />
        <el-table-column prop="end" label="结束时间" />
        <el-table-column prop="month" label="月份" />
        <el-table-column prop="year" label="年份" />
        <el-table-column prop="taskEstStarted" label="任务预计开始" />
        <el-table-column prop="taskRealStarted" label="任务实际开始" />
        <el-table-column prop="taskFinishedDate" label="任务完成时间" />
    </el-table>
    <div class="table-pagination">
        <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            v-model:current-page="filterForm.current"
            v-model:page-size="filterForm.size"
            :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background="false"
        ></el-pagination>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, RefreshRight, Upload } from '@element-plus/icons-vue'
import { downloadFile, handleExportError } from '@/utils/download';
import { 
    getEmployeeWorkHourList, 
    getEmployeeWorkProjectList, 
    getEmployeeExecutionList, 
    exportEmployeeWorkHourRecord,
    getEmployeeWorkHourSummary
} from '@/api/employee';

const form = ref(null)
const tableData = ref([])
const totalCount = ref(0)
const projectList = ref({})
const executionList = ref({})
const workhourSummary = ref()
const isLoading = ref(false)
const dateRange = ref([])
const filterForm = ref({
    name: "",
    year: "",
    month: "",
    startTime: "",
    endTime: "",
    project: "",
    post: "",
    task: "",
    current: 1,
    size: 10
})

const fetchEmployeeWorkHourList = async (filterData) => {
    try {
        isLoading.value = true
        const res = await getEmployeeWorkHourList(filterData)
        // console.log(res)
        tableData.value = res.data.records
        totalCount.value = res.data.total
        // console.log(tableData.value)
    } catch (error) {
        console.error(error)
    } finally {
        isLoading.value = false
    }
}

const fetchEmployeeWorkProjectList = async () => {
    try {
        const res = await getEmployeeWorkProjectList()
        projectList.value = res.data
        // console.log(projectList.value)
    } catch (error) {
        console.error(error)
    }
}

const fetchEmployeeExecutionList = async () => {
    try {
        const res = await getEmployeeExecutionList()
        executionList.value = res.data
    } catch (error) {
        console.error(error)
    }
}

const fetchEmployeeWorkHourSummary = async (filterData) => {
    try {
        const res = await getEmployeeWorkHourSummary(filterData)
        // console.log(res)
        workhourSummary.value = res.data.toFixed(2)
    } catch (error) {
        console.error(error)
    }
}

const handleSearch = () => {
    fetchEmployeeWorkHourList(filterForm.value)
    fetchEmployeeWorkHourSummary(filterForm.value)
}

const handleReset = () => {
    filterForm.value = {
        name: "",
        month: "",
        year: "",
        startTime: "",
        endTime: "",
        project: "",
        execution: "",
        post: "",
        task: "",
        current: 1,
        size: 10
    }
    dateRange.value = []
    fetchEmployeeWorkHourList(filterForm.value)
    fetchEmployeeWorkHourSummary(filterForm.value)
}

const handleExport = async () => {
    try {
        // 检查表格数据是否为空
        if (!tableData.value || tableData.value.length === 0) {
            ElMessage.warning('当前没有可导出的数据，请先搜索数据')
            return
        }
        const res = await exportEmployeeWorkHourRecord(filterForm.value)
        // console.log(res)
        downloadFile(res, res.headers)
    } catch (error) {
        console.error('导出接口异常', error)
        if (error.response?.data instanceof Blob) {
            await handleExportError(error.response.data)
        } else {
            ElMessage.error('导出失败，请检查网络')
        }
    }
}

const handleSizeChange = () => {
    filterForm.value.current = 1
    fetchEmployeeWorkHourList(filterForm.value)
}

const handleCurrentChange = () => {
    fetchEmployeeWorkHourList(filterForm.value)
}

const handleClear = () => {
    dateRange.value = []
}

watch(dateRange, newValue => {
    filterForm.value.startTime = newValue[0]
    filterForm.value.endTime = newValue[1]
})

onMounted(() => {
    fetchEmployeeWorkProjectList()
    fetchEmployeeExecutionList()
    fetchEmployeeWorkHourList(filterForm.value)
    fetchEmployeeWorkHourSummary(filterForm.value)
})
</script>

<style scoped>
.table-pagination {
    margin-top: 20px;
}

.work-hour {
    color: #666;
}
</style>