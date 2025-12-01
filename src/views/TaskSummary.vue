<template>
    <!-- <h1 style="font-size: 22px; margin-bottom: 20px;">项目情况汇总列表</h1> -->

    <el-form
        class="form"
        ref="form"
        :model="filterForm"
        :disabled="isLoading"
    >
        <el-row :gutter="20">
            <!-- <el-col>
                <el-form-item>
                    <h1 style="font-size: 22px;">项目情况汇总列表</h1>
                </el-form-item>
            </el-col> -->
            <el-col :span="5">
                <el-form-item label="项目:">
                    <el-select
                        v-model="filterForm.projectName"
                        @clear="handleClear"
                        clearable
                        @change="handleSelect"
                    >
                        <!-- <el-option label="请选择" value=""></el-option> -->
                        <el-option
                            v-for="project in projectList"
                            :key="project"
                            :label="project"
                            :value="project"
                        />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="5">
                <el-form-item label="执行:">
                    <el-select
                        :disabled="isDisabled"
                        v-model="filterForm.executionName"
                        :empty-values="[null]"
                    >
                        <el-option v-if="isDisabled" label="请先选择项目" value=""></el-option>
                        <el-option v-else label="全部" value=""></el-option>
                        <el-option
                            v-for="execution in executionList"
                            :key="execution"
                            :label="execution"
                            :value="execution"
                        />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="完成情况:">
                    <el-select
                        v-model="filterForm.fishStatus"
                        :empty-values="[null]"
                    >
                        <el-option label="全部" value=""></el-option>
                        <el-option label="未开始" value="wait"></el-option>
                        <el-option label="进行中" value="doing"></el-option>
                        <el-option label="已暂停" value="pause"></el-option>
                        <el-option label="已取消" value="cancel"></el-option>
                        <el-option label="已完成" value="done"></el-option>
                        <el-option label="已关闭" value="closed"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="任务执行人:">
                    <el-select
                        v-model="filterForm.account"
                        :empty-values="[null]"
                    >
                        <el-option label="全部" value=""></el-option>
                        <el-option
                            v-for="account in accountList"
                            :key="account.nickname"
                            :value="account.username"
                            :label="account.nickname"
                        />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item>
                    <el-button :icon="Upload" @click="handleExport">导出</el-button>
                    <el-button :icon="Search" type="primary" @click="handleSearch">搜索</el-button>
                    <el-button :icon="RefreshRight" type="info" plain @click="handleReset">重置</el-button>
                </el-form-item>
            </el-col>
        </el-row>

        <!-- <el-form-item style="float: right;">
            <el-button :icon="Search" type="primary" @click="handleSearch">搜索</el-button>
            <el-button :icon="RefreshRight" type="info" plain @click="handleReset">重置</el-button>
        </el-form-item> -->
    </el-form>

    <el-table
        class="table"
        v-loading="isLoading"
        :data="tableData"
        :span-method="spanMethod"
        border
        :cell-style="{ color: '#000' }"
    >
        <el-table-column prop="projectName" label="项目"></el-table-column>
        <el-table-column prop="executeName" label="执行"></el-table-column>
        <el-table-column prop="taskName" label="任务" show-overflow-tooltip></el-table-column>
        <el-table-column prop="subTaskName" label="子任务"></el-table-column>
        <el-table-column prop="description" label="任务描述" show-overflow-tooltip>
            <template #default="scope">
                <!-- 使用 v-html 指令来渲染 HTML 内容 -->
                 <div v-html="scope.row.description"></div>
            </template>
        </el-table-column>
        <el-table-column prop="executor" label="任务执行人"></el-table-column>
        <el-table-column prop="expectedStartTime" label="预计开始"></el-table-column>
        <el-table-column prop="expectedEndTime" label="预计交付"></el-table-column>
        <el-table-column prop="actualEndTime" label="实际交付"></el-table-column>
        <el-table-column prop="priority" label="优先级"></el-table-column>
        <el-table-column label="完成情况">
            <template #default="scope">
                <!-- 动态渲染完成情况 -->
                <span>
                    {{ getStatusText(scope.row.fishStatus) }}
                </span>
            </template>
        </el-table-column>
    </el-table>


</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, RefreshRight, Upload } from '@element-plus/icons-vue'
import { downloadFile, handleExportError } from '@/utils/download';
import { fetchProjectSummary, fetchProjectExecution, exportProjectSummary } from '@/api/project';
import { getEmployeeWorkProjectList, getEmployeeExecutionList, getUserList } from '@/api/employee';

const isLoading = ref(false)
const isDisabled = ref(true)
const tableData = ref([])
const projectList = ref([])
const executionList = ref([])
const accountList = ref([])
const filterForm = ref({
    projectName: '',
    executionName: '',
    fishStatus: '',
    account: ''
})

// 预处理合并规则
function processMergeRules(data) {
    if (!data || data.length === 0) return []

    const result = [...data]
    let i = 0

    while (i < result.length) {
        const currentProject = result[i].projectName

        // 处理 projectName 的合并
        // 找到当前项目的最后一个索引
        let projectEndIndex = i
        while (projectEndIndex + 1 < result.length && result[projectEndIndex + 1].projectName === currentProject) {
            projectEndIndex++
        }
        const projectSpan = projectEndIndex - i + 1
        // 为当前项目的第一行设备 projectSpan
        result[i].projectSpan = projectSpan
        // 为当前项目的其他行设置 projectSpan 为 0 (表示被合并)
        for (let j = i + 1; j <= projectEndIndex; j++) {
            result[j].projectSpan = 0
        }

        // 在当前项目内，处理 executeName 的合并
        let j = i
        while (j <= projectEndIndex) {
            const currentExecute = result[j].executeName

            // 找到当前执行名称在当前项目内的最后一个索引
            let executeEndIndex = j
            while (executeEndIndex + 1 <= projectEndIndex && result[executeEndIndex + 1].executeName === currentExecute) {
                executeEndIndex++
            }
            const executeSpan = executeEndIndex - j + 1
            // 为当前执行名称的第一行设置 executeSpan
            result[j].executeSpan = executeSpan
            // 为当前执行名称的其他行设置 executeSpan 为 0
            for (let k = j + 1; k <= executeEndIndex; k++) {
                result[k].executeSpan = 0
            }

            // 在当前项目内，处理 taskName 的合并
            let k = j
            while (k <= executeEndIndex) {
                const currentTask = result[k].taskName

                // 找到当前任务名称在当前项目内的最后一个索引
                let taskEndIndex = k
                while (taskEndIndex + 1 <= executeEndIndex && result[taskEndIndex + 1].taskName === currentTask) {
                    taskEndIndex++
                }
                const taskSpan = taskEndIndex - k + 1
                // 为当前任务名称的第一行设置 taskSpan
                result[k].taskSpan = taskSpan
                // 为当前执行名称的其他行设置 taskSpan 为 0
                for (let g = k + 1; g <= taskEndIndex; g++) {
                    result[g].taskSpan = 0
                }

                k = taskEndIndex + 1
            }

            j = executeEndIndex + 1  // 移动到下一个不同的 executeName
        }

        i = projectEndIndex + 1
    }

    return result
}

const spanMethod = ({ row, column, rowIndex, columnIndex }) => {
    // console.log(`[spanMethod] 行: ${rowIndex}, 列索引: ${columnIndex}, column.prop: '${column.property}'`);
    // console.dir(column)
    // 对 "项目" 这一列进行合并操作
    if (column.property === 'projectName') {
        // 如果 projectSpan 为 0，表示该单元格被合并，不渲染
        return row.projectSpan === 0 ? { rowspan: 0, colspan: 0 } : { rowspan: row.projectSpan, colspan: 1 }
    }
    // 对 "执行" 这一列进行合并操作
    else if (column.property === 'executeName') {
        // 如果 executeSpan 为 0，表示该单元格被合并，不渲染
        return row.executeSpan === 0 ? { rowspan: 0, colspan: 0 } : { rowspan: row.executeSpan, colspan: 1 }
    }
    else if (column.property === 'taskName') {
        return row.taskSpan === 0 ? { rowspan: 0, colspan: 0 } : { rowspan: row.taskSpan, colspan: 1 }
    } 

    // 对于其他列，不做任何处理，使用默认值
    return {
        rowspan: 1,
        colspan: 1
    }
}

const getStatusText = (status) => {
    switch(status) {
        case 'done':
            return '已完成';
        case 'wait':
            return '未开始';
        case 'doing':
            return '进行中';
        case 'pause':
            return '已暂停';
        case 'cancel':
            return '已取消';
        case 'closed':
            return '已关闭';
        default:
            return '未知状态' 
    }
}

const getProjectSummary = async (data) => {
    try {
        isLoading.value = true
        const res = await fetchProjectSummary(data)
        // console.log('原始数据:', res.data)

        // 对原始数据进行预处理，计算合并规则
        const processedData = processMergeRules(res.data)
        // console.log('处理后的数据:', processedData)

        // 将处理后的数据赋值给 tableData
        tableData.value = processedData
    } catch (error) {
        console.error(error)
    } finally {
        isLoading.value = false
    }
}

const getProjectExecution = async (data) => {
    try {
        const res = await fetchProjectExecution(data)
        // console.log(res)
        executionList.value = res.data
    } catch (error) {
        console.error(error)
    }
}

const handleSelect = () => {
    filterForm.value.executionName = ''
    executionList.value = []
    getProjectExecution(filterForm.value.projectName)
}

const handleClear = () => {
    // console.log(isDisabled.value)
    isDisabled.value = true
    filterForm.value = {
        projectName: '',
        executionName: '',
        fishStatus: '',
        account: ''
    }
    // console.log(isDisabled.value)
}

const handleSearch = () => {
    getProjectSummary(filterForm.value)
}

const handleReset = () => {
    filterForm.value = {
        projectName: '',
        executionName: '',
        fishStatus: '',
        account: ''
    }
    getProjectSummary(filterForm.value)
}

const handleExport = async () => {
    try {
        // 检查表格数据是否为空
        if (!tableData.value || tableData.value.length === 0) {
            ElMessage.warning('当前没有可导出的数据，请先搜索数据')
            return
        }
        const res = await exportProjectSummary(filterForm.value)
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

const fetchEmployeeWorkProjectList = async () => {
    try {
        const res = await getEmployeeWorkProjectList()
        projectList.value = res.data
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

const fetchAccountList = async () => {
    try {
        const res = await getUserList()
        accountList.value = res.data.map(user => {
            return {
                username: user.username,
                nickname: user.nickname
            }
        })
        // console.log(accountList.value)
    } catch (error) {
        console.error(error)
    }
}

watch(() => filterForm.value.projectName, (newVal) => {
    if (newVal !== '') {
        isDisabled.value = false
    } else if (newVal === '') {
        filterForm.value.projectName = ''
        isDisabled.value = true
    } else if (newVal === null) {
        filterForm.value.projectName = ''
    }
},
{
    immediate: true,
    deep: true
}
)

onMounted(() => {
    fetchEmployeeWorkProjectList()
    // fetchEmployeeExecutionList()
    fetchAccountList()
    getProjectSummary(filterForm.value)
})
</script>

<style scoped>
.form {
    position: fixed;
      z-index: 99;
      top: 60px;           /* 设置距离顶部的位置 */
      left: 185px;          /* 设置距离左侧的位置 */
      right: 0;         /* 设置距离右侧的位置 */
      /* margin: 0 30px; */
      background-color: #fff;  /* 添加背景色，避免内容透过 */
      padding: 20px;    /* 添加内边距 */
      box-shadow: 0 2px 2px rgba(0,0,0,0.1);
}

.table {
    margin-top: 90px;
}

</style>