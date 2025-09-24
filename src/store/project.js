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
        fetchCompMilestonesCount,
        fetchNewProjectCount,
        fetchDelayProjectCount
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
    const projectDetails = ref([])
    const newProjectCount = ref(0)
    const delayProjectCount = ref(0)

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

    const getProjectDetails = async () => {
        try {
            const res = await request.get('project/details')
            // console.log(res)
            if (res.code == 200 && res.success) {
                projectDetails.value = res.data.projects || 
                console.log(projectDetails.value)
            }
        } catch (error) {
            console.error('获取项目详情失败', error)
        }
    }

    // 获取当月新项目的数量
    const getNewProjectCount = async () => {
        const res = await fetchNewProjectCount()
        // console.log(res)
        newProjectCount.value = res.data.thisMonthNewProjects
    }

    // 获取目前延期的所有项目数量
    const getDelayProjectCount = async () => {
        const res = await fetchDelayProjectCount()
        // console.log(res)
        delayProjectCount.value = res.data
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
        projectDetails,
        newProjectCount,
        delayProjectCount,
        getTotalProjects,
        getTotalUserCount,
        getOngoingProjectsCount,
        getCompletedProjCount,
        getTotalManDaysCount,
        getCompMilestonesCount,
        fetchProjWorkHoursDistribution,
        getProjectDetails,
        getNewProjectCount,
        getDelayProjectCount
    }
})