import axios from "axios";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import request from '@/utils/request'

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

    const getTotalProjects = async () => {
        const res = await request.get('data/totalProjectsCount')
        // console.log(res)
        totalProjects.value = res.data
    }

    const getTotalUserCount = async () => {
        const res = await request.get('user/userAndRoleCount')
        // console.log(res)
        totalUserCount.value = res.data.totalUsers
        totalTeamCount.value = res.data.distinctRoles
    }

    const getOngoingProjectsCount = async () => {
        const res = await request.get('data/ongoingProjectsCount')
        // console.log(res)
        ongoingProjCount.value = res.data
    }

    const getCompletedProjCount = async () => {
        const res = await request.get('data/completedProjectsCount')
        // console.log(res)
        completedProjCount.value=res.data
    }

    const getTotalManDaysCount = async () => {
        const res = await request.get('data/totalManDaysCount')
        // console.log(res)
        totalManDaysCount.value=res.data
    }

    const getCompMilestonesCount = async () => {
        const res = await request.get('data/completedMilestonesCount')
        // console.log(res)
        totalTasks.value = res.data.totalTasks
        totalCompletedTasks.value = res.data.totalCompletedTasks
    }

    const completionRate = computed(() => {
        if (totalTasks.value === 0) return 0
        return ((totalCompletedTasks.value / totalTasks.value) * 100).toFixed(2)
    })

    const fetchProjWorkHoursDistribution = async () => {
        const res = await request.get('data/projectWorkHoursDistribution')
        console.log(res)

        projectName.value = res.data.map(item => item.projectName)
        // console.log(projectName.value)

        totalConsumed.value = res.data.map(item => item.totalConsumed)
        // console.log(totalConsumed.value)
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