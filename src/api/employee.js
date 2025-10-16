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