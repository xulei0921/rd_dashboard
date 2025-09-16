import axios from "axios";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import request from '@/utils/request'

// 项目模块
export const useProjectStore = defineStore('big-project', () => {
    const totalProjects = ref(0)
    const totalUserCount = ref(0)
    const ongoingProjCount = ref(0)
    const completedProjCount = ref(0)
    const totalManDaysCount = ref(0)

    const getTotalProjects = async () => {
        const res = await request.get('data/totalProjectsCount')
        // console.log(res)
        totalProjects.value = res.data
    }

    const getTotalUserCount = async () => {
        const res = await request.get('user/totalUsersCount')
        // console.log(res)
        totalUserCount.value = res.data
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

    const completionRate = computed(() => {
        if (totalProjects.value === 0) return 0
        return ((completedProjCount.value / totalProjects.value) * 100).toFixed(2)
    })

    return {
        totalProjects,
        totalUserCount,
        ongoingProjCount,
        completedProjCount,
        totalManDaysCount,
        completionRate,
        getTotalProjects,
        getTotalUserCount,
        getOngoingProjectsCount,
        getCompletedProjCount,
        getTotalManDaysCount
    }
})