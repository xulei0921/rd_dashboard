import request from '@/utils/request'
import { baseURL } from '@/utils/request'

// 获取员工工时排名数据
export const getEmployeeRanking = (timeFilter) => {
    return request.get('/data/employeeWorkHoursRanking', {
        params: timeFilter
    })
}

// 获取员工进度与工时统计
export const getEmployeeProgressList = () => {
    return request.post('/employee-progress/list', {
        
    })
}

export const isDataEmpty = (startTime, endTime) => {
    return request.get(`/api/workhour/export?startTime=${startTime}&endTime=${endTime}`)
}

// 导出指定时间段的工时数据到Excel文件
export const exportEmployeeWokeHoursData = (startTime, endTime) => {
    // const res = request.get(`/api/workhour/export?startTime=${startTime}&endTime=${endTime}`)
    // return res
    return `${baseURL}/api/workhour/export?startTime=${startTime}&endTime=${endTime}`
}


// 导出指定时间段的工时数据到Excel文件（精简版）
export const exportBriefEmployeeWokeHoursData = (startTime, endTime) => {
    return `${baseURL}/api/workhour/exportSimple?startTime=${startTime}&endTime=${endTime}`
}

// 获取员工工时列表
export const getEmployeeWorkHourList = (data) => {
    return request.post('/api/workhour/list', data)
}

// 获取所有项目名称列表
export const getEmployeeWorkProjectList = () => {
    return request.get('/api/workhour/projectList')
}

// 获取所有执行名称列表
export const getEmployeeExecutionList = () => {
    return request.get('/api/workhour/executionList')
}

// 报表中心导出员工工时记录
export const exportEmployeeWorkHourRecord = (params) => {
    return request({
        method: 'POST',
        url: '/api/workhour/exportDetailList',
        data: params,
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 根据筛选条件获取员工工时汇总
export const getEmployeeWorkHourSummary = (data) => {
    return request.post('/api/workhour/totalHour', data)
}

// 获取所有用户列表
export const getUserList = () => {
    return request.get('/user/list')
}