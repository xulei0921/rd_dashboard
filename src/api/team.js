import request from '@/utils/request'

// 获取团队工时对比
export const fetchTeamWorkHoursComparison = () => {
    return request.get('data/teamWorkHoursComparison')
}