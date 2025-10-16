<template>
    <el-dialog
        title="员工工时导出"
        :model-value="visible"
        :before-close="handleClose"
        width='700px'
        destroy-on-close
        align-center="true"   
    >
        <div class="block">
            <span class="demonstration">请选择时间范围:</span>
            <el-date-picker 
                v-model="DateValue"
                type="monthrange"
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                @change="handleChange"
                :disabled-date="disabledDate"
            />
        </div>
        <div>
            <span class="demonstration">是否精简导出:</span>
            <el-switch v-model="isBriefExport"></el-switch>
        </div>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button v-if="!isBriefExport" type="primary" @click="confirmExport">完整导出</el-button>
            <el-button v-else type="primary" @click="confirmBriefExport">精简导出</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { defineProps, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { exportEmployeeWokeHoursData, exportBriefEmployeeWokeHoursData, isDataEmpty } from '@/api/employee';
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
})

const DateValue = ref([])
const StartDate = ref('')
const EndDate = ref('')
const currentDate = new Date()
const currentYear = currentDate.getFullYear()
const currentMonth = currentDate.getMonth()
const isBriefExport = ref(false)

const emit = defineEmits(['update:visible', 'close'])

const handleClose = () => {
    emit('update:visible', false)
    emit('close')
}

const formatYearMonth = (date) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${year}%2C${month}`
}

const disabledDate = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return year > currentYear || (year === currentYear && month >= currentMonth)

    // return date >= new Date()
}

const handleChange = () => {
    if (DateValue.value && DateValue.value.length === 2) {
        StartDate.value = formatYearMonth(DateValue.value[0])
        EndDate.value = formatYearMonth(DateValue.value[1])

        // console.log(StartDate.value)
        // console.log(EndDate.value)
    }
}

const confirmExport = async () => {
    // const res = await exportEmployeeWokeHoursData(StartDate.value, EndDate.value)
    // console.log(res)
    const res = await isDataEmpty(StartDate.value, EndDate.value)
    if(res.message) {
        ElMessage.error(res.data)
    } else {
        ElMessage.success('工时数据导出成功')
        window.location.href = await exportEmployeeWokeHoursData(StartDate.value, EndDate.value)
    }
}

const confirmBriefExport = async () => {
    const res = await isDataEmpty(StartDate.value, EndDate.value)
    if(res.message) {
        ElMessage.error(res.data)
    } else {
        ElMessage.success('工时数据导出成功')
        window.location.href = await exportBriefEmployeeWokeHoursData(StartDate.value, EndDate.value)
    }
}
</script>

<style scoped>
.block {
    margin-bottom: 15px;
}

.demonstration {
    margin-right: 15px;
}
</style>