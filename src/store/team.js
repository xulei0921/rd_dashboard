import { defineStore } from "pinia";
import { ref } from "vue";
import {
    fetchTeamWorkHoursComparison
} from '@/api/team'

// 团队模块
export const useTeamStore = defineStore('team', () => {
    const getTeamWorkHoursComparison = async () => {
        const res = await fetchTeamWorkHoursComparison()
        console.log(res)
    }

    return {
        getTeamWorkHoursComparison
    }
})