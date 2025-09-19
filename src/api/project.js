import request from '@/utils/request'

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
export const fetchProjectProgressTrend = () => {
    return request.get('data/projectProgressTrend')
}

// 获取项目工时分布数据
export const getProjWorkHoursDistribution = () => {
    return request.get('/data/projectWorkHoursDistribution')
}