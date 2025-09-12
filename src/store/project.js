import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import request from '@/utils/request'

// 项目模块
export const useProjectStore = defineStore('big-project', () => {
    const totalCount = ref(0)

    const teamMembers = ref(0)

    const getList = async () => {
        const res = await request.get('statistics/dashboard')
        console.log(res.data)
        totalCount.value = res.data.totalBusinessData
    }

    const getTeamMembers = async () => {
        const res = await request.get('user/statistics')
        console.log(res.data)
        teamMembers.value = res.data.total
    }

    return {
        totalCount,
        teamMembers,
        getList,
        getTeamMembers
    }
})