import { defineStore } from "pinia";
import { computed, ref } from "vue";
import request from '@/utils/request'
import { 
        fetchTotalProjects,
        getProjWorkHoursDistribution,
        fetchTotalUserCount,
        fetchOngoingProjectsCount,
        fetchCompletedProjCount,
        fetchTotalManDaysCount,
        fetchCompMilestonesCount
       } from "@/api/project";

// 项目模块
export const useProjectStore = defineStore('big-project', () => {
    const totalProjects = ref(0)
    const totalUserCount = ref(0)
    const totalTeamCount = ref(0)
    const ongoingProjCount = ref(0)
    const completedProjCount = ref(0)
    const totalManDaysCount = ref(0)
    const totalTasks = ref(0)
    const totalCompletedTasks = ref(0)
    const totalConsumed = ref([])
    const projectName = ref([])

    // 获取总项目数
    const getTotalProjects = async () => {
        // const res = await request.get('data/totalProjectsCount')
        const res = await fetchTotalProjects()
        // console.log(res)

        totalProjects.value = res.data
    }

    // 获取团队成员人数
    const getTotalUserCount = async () => {
        // const res = await request.get('user/userAndRoleCount')
        const res = await fetchTotalUserCount()
        // console.log(res)

        totalUserCount.value = res.data.totalUsers
        totalTeamCount.value = res.data.distinctRoles
    }

    // 获取进行中的项目数量
    const getOngoingProjectsCount = async () => {
        // const res = await request.get('data/ongoingProjectsCount')
        const res = await fetchOngoingProjectsCount()
        // console.log(res)

        ongoingProjCount.value = res.data
    }

    // 获取已完成的项目数量
    const getCompletedProjCount = async () => {
        // const res = await request.get('data/completedProjectsCount')
        const res = await fetchCompletedProjCount()
        // console.log(res)

        completedProjCount.value=res.data
    }

    // 获取总工时
    const getTotalManDaysCount = async () => {
        // const res = await request.get('data/totalManDaysCount')
        const res = await fetchTotalManDaysCount()
        // console.log(res)

        totalManDaysCount.value=res.data
    }

    // 获取已完成里程碑数据
    const getCompMilestonesCount = async () => {
        // const res = await request.get('data/completedMilestonesCount')
        const res = await fetchCompMilestonesCount()
        // console.log(res)

        totalTasks.value = res.data.totalTasks
        totalCompletedTasks.value = res.data.totalCompletedTasks
    }

    const completionRate = computed(() => {
        if (totalTasks.value === 0) return 0
        return ((totalCompletedTasks.value / totalTasks.value) * 100).toFixed(2)
    })

    // 获取项目工时分布数据
    const fetchProjWorkHoursDistribution = async () => {
        try {
            // const res = await request.get('data/projectWorkHoursDistribution')
            const res = await getProjWorkHoursDistribution()
            // console.log(res)

            // 检查接口返回是否正常
            if (res.code == 200 && res.success) {
                // 提取项目名称和工时数据
                projectName.value = res.data.map(item => item.projectName)
                // console.log(projectName.value)

                totalConsumed.value = res.data.map(item => item.totalConsumed)
                // console.log(totalConsumed.value)
            } else {
                console.error("获取项目工时分布失败:", res.message)
                // 重置数据
                projectName.value = []
                totalConsumed.value = []
            }
        } catch (error) {
            console.error('请求项目工时分布接口出错:', error)
            // 重置数据
            projectName.value = []
            totalConsumed.value = []
        }
    }

    return {
        totalProjects,
        totalUserCount,
        totalTeamCount,
        ongoingProjCount,
        completedProjCount,
        totalManDaysCount,
        completionRate,
        totalTasks,
        totalCompletedTasks,
        projectName,
        totalConsumed,
        getTotalProjects,
        getTotalUserCount,
        getOngoingProjectsCount,
        getCompletedProjCount,
        getTotalManDaysCount,
        getCompMilestonesCount,
        fetchProjWorkHoursDistribution
    }
})