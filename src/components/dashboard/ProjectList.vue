<template>
  <div class="project-list">
    <h2 class="title" style="margin-bottom: 25px;">项目进度详情与里程碑</h2>
    <div class="search-bar">
      <input type="text" placeholder="搜索项目..." />
    </div>
    <ProjectItem 
      v-for="(project, index) in projectDeatils" 
      :key="index" 
      :project="project"
    />
    <button class="load-more">查看更多项目</button>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import ProjectItem from "./ProjectItem.vue";
import { storeToRefs } from "pinia";
import { useProjectStore } from "@/store";

const projectStore = useProjectStore()

const {
        projectDeatils
      } = storeToRefs(projectStore)

const {
        getProjectDetails
      } = projectStore

onMounted (() => {
    getProjectDetails()
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
  padding: 16px;
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
</style>