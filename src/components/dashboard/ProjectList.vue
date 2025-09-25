<template>
  <div class="project-list">
    <h2 class="title" style="margin-bottom: 25px;">项目进度详情与里程碑</h2>
    <span class="project-count">项目总数: <strong>{{ ProjectCount }}</strong> 个</span>
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading">加载项目数据中...</div>

    <!-- 错误状态 -->
    <div v-else-if="hasError" class="error">获取项目数据失败，请稍后重试</div>
    <template v-else>
        
        <div class="search-bar">
          <el-input type="text" clearable v-model="searchKeyWords" placeholder="搜索项目..."/>
        </div>

        <!-- 无数据状态 -->
        <div v-if="filteredProjectDetails.length === 0" class="empty">暂无项目数据</div>

        <!-- 以项目为单位渲染 -->
        <ProjectItem v-for="value in filteredProjectDetails"
            :key="value.id"
            :projectId="value.id"
        ></ProjectItem>
        <!-- <button class="load-more">查看更多项目</button> -->
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import ProjectItem from "./ProjectItem.vue";
import { storeToRefs } from "pinia";
import { useProjectStore } from "@/store";

const searchKeyWords = ref('')
const projectStore = useProjectStore()
const filteredProjectDetails = ref([])
const allProjectDetails = ref([])
const isLoading = ref(true)
const hasError = ref(false)
const ProjectCount = ref(0)

const {
        projectDetails
      } = storeToRefs(projectStore)

const {
        getProjectDetails
      } = projectStore

// const filteredProjectDetails = computed(() => {
//     if (!projectDetails.value || projectDetails.value.length === 0) {
//         return []
//     }

//     if (!searchKeyWords) {
//         return projectDetails.value
//     }
// })

// 监听搜索输入框的输入
watch(searchKeyWords, (keyword) => {
    // 如果搜索框没有输入搜索关键字，直接返回所有项目数据
    if (!keyword) {
      filteredProjectDetails.value = allProjectDetails.value
      return
    } else {
      // 测试watch监听是否生效 
      // filteredProjectDetails.value = []
      // console.log('test')

      // 将搜索关键字左右两边去除空格并为小写
      const kword = keyword.trim().toLowerCase()
      // 将项目名包含关键字的所有项目筛选过滤出来
      filteredProjectDetails.value = allProjectDetails.value.filter(item => item.projectName.toLowerCase().includes(kword))
    }
})

onMounted (async () => {
    // 从后端获取项目数据
    try {
        // 重置加载状态和错误状态
        isLoading.value = true
        hasError.value = false
        await getProjectDetails()
        filteredProjectDetails.value = projectDetails.value
        // console.log(filteredProjectDetails.value)
        allProjectDetails.value = projectDetails.value
        ProjectCount.value = allProjectDetails.value.length
        console.log(`项目总数量${ProjectCount.value}`)
        // console.log(allProjectDetails.value)
    } catch (error) {
        console.log('获取项目详情失败:', error)
        hasError.value = true
    } finally {
        // 无论获取结果如何，将加载状态取消
        isLoading.value = false
    }
})
</script>

<style scoped>
.project-list {
  position: relative;
  /* max-width: 800px; */
  width: 100%;
  margin: 0 auto;
  padding: 16px;
}
.project-count {
  position: absolute;
  color: #666;
  top: 23px;
  left: 270px;
}
.search-bar {
  /* margin-bottom: 16px; */
  display: flex;
  padding: 20px;
  position: absolute;
  top: 0;
  right: 0;
}
.search-bar input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.load-more {
  display: block;
  margin: 16px auto;
  padding: 8px 16px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}
.loading {
    text-align: center;
    padding: 40px;
    color: #666;
}
.error {
    text-align: center;
    padding: 40px;
    color: #ff4d4f;
}
.empty {
    text-align: center;
    padding: 40px;
    color: #999;
}

.back-to-top {
  position: fixed;
  right: 20px;
  top: 500px;
  /* bottom: 20px; */
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #165DFF;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: opacity 0.3s, transform 0.3s;
  opacity: 0.9;
}
</style>