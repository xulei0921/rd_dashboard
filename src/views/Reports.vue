<template>
    <el-container>
        <el-aside class="aside-menu">
            <el-menu
                class="sidebar-menu"
                active-text-color=""
                router
                :default-active="route.path"
            >
                <el-menu-item index="/reports/workhour-list">
                    <el-icon><UserFilled /></el-icon>
                    <span>员工工时列表</span>
                </el-menu-item>

                <el-menu-item index="/reports/task-summary">
                    <el-icon><Histogram /></el-icon>
                    <span>项目情况汇总</span>
                </el-menu-item>
            </el-menu>
        </el-aside>

        <el-container style="margin-left: 185px;">
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import { UserFilled, Histogram } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';

const route = useRoute()
</script>

<style scoped>
.aside-menu {
    position: fixed;
    height: 100vh;
    width: 185px;
    /* width: 12%; */
    /* margin-left: 3px; */
    /* margin-bottom: 98px; */
    background-color: #FFFFFF;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    z-index: 99;
}
.sidebar-menu {
    border: none;
}
</style>