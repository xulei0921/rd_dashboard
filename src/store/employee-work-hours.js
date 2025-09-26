import { defineStore } from "pinia";
import { ref } from "vue";
import request from '@/utils/request';
import { getEmployeeRanking, getEmployeeProgressList } from '@/api/employee'

export const useEmployeeWorkHoursStore = defineStore('employee-work-hours', () => {
  // 状态
  const employeeRanking = ref([]); // 排名数据
  const loading = ref(false); // 加载状态
  const currentWorkHours = ref(0) // 本月总工时
  const employeeData = ref([])

  // 时间过滤器映射（前端value -> 后端timeFilter）
  const timeFilterMap = {
    'month': 1,        // 本月
    'lastMonth': 2,    // 上月
    'quarter': 3,      // 本季度
    'year': 4          // 本年度
  };

  // 获取员工工时排名数据
  const fetchEmployeeRanking = async (timeRange = 'month') => {
    try {
      loading.value = true;
      // 转换时间参数
      const timeFilter = timeFilterMap[timeRange];
      
      // 调用后端接口
      const res = await request.get('/data/employeeWorkHoursRanking', {
        params: { timeFilter }
      });
      // const res = await getEmployeeRanking(timeFilter)

      // console.log(res)
      // 处理数据格式（适配RankingItem组件）
      if (res.code === 200 && res.success) {
        employeeRanking.value = res.data.map((item, index) => {
          // 计算趋势（这里使用mom_work_hours判断）
          const trend = item.momWorkHours > 0 ? 'increase' : 'decrease';
          const trendValue = (Math.abs(item.momWorkHours)).toFixed(1) + '%';
          
          // 格式化工时（保留一位小数 + "小时"）
          const hours = parseFloat(item.totalWorkHours).toFixed(1) + '小时';
          
          return {
            name: item.realname,
            team: item.teamName,
            hours,
            trend,
            trendValue,
            // 生成随机头像（使用picsum.photos，基于名字哈希确保一致性）
            avatar: `https://picsum.photos/id/${index + 100}/200/200`
          };
        });

        currentWorkHours.value = employeeRanking.value.reduce((sum, item) => {
          // 提取 hours 字段中的数字部分
          const hoursStr = item.hours.replace("小时", "")

          const hour = Number(hoursStr)

           return sum + (isNaN(hour) ? 0 : hour)
        }, 0)

      }
    } catch (error) {
      console.error('获取员工工时排名失败:', error);
      employeeRanking.value = []; // 出错时清空数据
    } finally {
      loading.value = false;
    }
  };

  // 获取员工进度与工时统计
  const fetchEmployeeProgressList = async () => {
    const res = await getEmployeeProgressList()
    console.log(res.data)
    employeeData.value = res.data
  }

  return {
    employeeRanking,
    loading,
    currentWorkHours,
    employeeData,
    fetchEmployeeRanking,
    fetchEmployeeProgressList
  };
});