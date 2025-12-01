import request from '@/utils/request'
import { baseURL } from '@/utils/request'

// 获取总项目数
export const fetchTotalProjects = () => {
    return request.get('data/totalProjectsCount')
}

// 获取团队成员人数
export const fetchTotalUserCount = () => {
    return request.get('user/userAndRoleCount')
}

// 获取进行中的项目数量
export const fetchOngoingProjectsCount = () => {
    return request.get('data/ongoingProjectsCount')
}

// 获取已完成的项目数量
export const fetchCompletedProjCount = () => {
    return request.get('data/completedProjectsCount')
}

// 获取总工时
export const fetchTotalManDaysCount = () => {
    return request.get('data/totalManDaysCount')
}

// 获取已完成里程碑数据
export const fetchCompMilestonesCount = () => {
    return request.get('data/completedMilestonesCount')
}

// 获取项目进度趋势数据
// export const fetchProjectProgressTrend = () => {
//     return request.get('data/projectProgressTrend')
// }

export const fetchProjectProgressTrend = () => {
    return fetch(`${baseURL}/data/projectProgressTrend`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
}

// 获取项目工时分布数据
export const getProjWorkHoursDistribution = () => {
    return request.get('data/projectWorkHoursDistribution')
}

// 获取当月新项目的数量
export const fetchNewProjectCount = () => {
    return request.get('project/monthlyNewProjects')
}

// 获取目前延期的所有项目数量
export const fetchDelayProjectCount = () => {
    return request.get('project/delayedProjects')
}

// 获取项目情况汇总数据
export const fetchProjectSummary = (filterData) => {
    return request.get('/api/workhour/projectQKSummary', {
        params: filterData
    })
}

// 获取对应项目的执行
export const fetchProjectExecution = (data) => {
    return request.get(`/api/workhour/projectExecutors?projectName=${data}`)
}

// 报表中心导出项目情况汇总
export const exportProjectSummary = (params) => {
    return request({
        method: 'POST',
        url: '/api/workhour/exportProjectQKSummary',
        data: params,
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    // return request.post('/api/workhour/exportProjectQKSummary', params)
}