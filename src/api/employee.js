import request from '@/utils/request'

// 获取员工工时排名数据
export const getEmployeeRanking = (timeFilter) => {
    return request.get('data/employeeWorkHoursRanking', {
        params: timeFilter
    })
}