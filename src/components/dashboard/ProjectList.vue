<template>
  <div class="project-list">
    <h2 class="title" style="margin-bottom: 25px;">项目进度详情与里程碑</h2>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading">加载项目数据中...</div>

    <!-- 错误状态 -->
    <div v-else-if="hasError" class="error">获取项目数据失败，请稍后重试</div>
    <template v-else>
        <div class="search-bar">
          <el-input type="text" v-model="searchKeyWords" placeholder="搜索项目..."/>
        </div>

        <!-- 无数据状态 -->
        <div v-if="filteredProjectDetails.length === 0" class="empty">暂无项目数据</div>

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
     
watch(searchKeyWords, (keyword) => {
    if (!keyword) {
        filteredProjectDetails.value = allProjectDetails.value
        return
    } else {
        // filteredProjectDetails.value = []
        // console.log('test')

        const kword = keyword.trim().toLowerCase()
        filteredProjectDetails.value = allProjectDetails.value.filter(item => item.projectName.includes(kword))
    }
})

onMounted (async () => {
    try {
        isLoading.value = true
        hasError.value = false
        await getProjectDetails()
        filteredProjectDetails.value = projectDetails.value
        // console.log(filteredProjectDetails.value)
        allProjectDetails.value = projectDetails.value
        // console.log(allProjectDetails.value)
    } catch (error) {
        console.log('获取项目详情失败:', error)
        hasError.value = true
    } finally {
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
.search-bar {
  /* margin-bottom: 16px; */
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
</style>