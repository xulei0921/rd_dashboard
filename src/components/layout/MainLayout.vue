<template>
  <el-container class="main-container">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="logo">
        <el-icon :size="24" class="mr-2"><Grid /></el-icon>
        <span class="title">研发管理驾驶舱</span>
      </div>
      
      <el-menu 
        :default-active="activeRoute" 
        mode="horizontal"
        class="nav-menu"
        @select="handleMenuSelect"
      >
        <el-menu-item index="/">
          <el-icon :size="18" class="mr-1"><User/></el-icon>
          <span>总览</span>
        </el-menu-item>
        <el-menu-item index="/projects">
          <el-icon :size="18" class="mr-1"><Files /></el-icon>
          <span>项目管理</span>
        </el-menu-item>
        <el-menu-item index="/team">
          <el-icon :size="18" class="mr-1"><UserFilled /></el-icon>
          <span>团队管理</span>
        </el-menu-item>
        <el-menu-item index="/reports">
          <el-icon :size="18" class="mr-1"><Document /></el-icon>
          <span>报表中心</span>
        </el-menu-item>
      </el-menu>
      
      <div class="header-actions">
        <el-select v-model="timeRange" placeholder="选择时间范围" size="small" class="mr-2">
          <el-option label="本周" value="week"></el-option>
          <el-option label="本月" value="month"></el-option>
          <el-option label="本季度" value="quarter"></el-option>
          <el-option label="本年度" value="year"></el-option>
        </el-select>
        
        <el-button :icon="Refresh" size="small" class="mr-2" @click="handleRefresh"></el-button>
        
        <el-badge :value="5" class="message-badge">
          <el-button :icon="Bell" size="small" class="mr-2"></el-button>
        </el-badge>
        
        <el-dropdown placement="bottom-end">
          <el-button type="text" class="user-btn">
            <el-avatar class="mr-2"><img src="https://picsum.photos/id/1005/200/200" alt="用户头像"></el-avatar>
            <span class="nickname">张经理</span>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    
    <!-- 主内容区 -->
    <el-main class="main-content">
      <router-view />
    </el-main>
    
    <!-- 页脚 -->
    <el-footer class="footer">
      <div class="footer-content">
        <p>© 2023 软件研发管理平台 | 数据每30分钟同步一次</p>
        <div class="footer-links">
          <a href="#">使用指南</a>
          <a href="#">帮助中心</a>
          <a href="#">联系支持</a>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  User, Files, UserFilled, Document, 
  Refresh, Bell, 
  Grid
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 状态
const timeRange = ref('month')
const activeRoute = computed(() => route.path)

// 方法
const handleMenuSelect = (index) => {
  router.push(index)
}

const handleRefresh = () => {
  // 刷新数据的逻辑
  console.log('刷新数据')
}
</script>

<style scoped>
.main-container {
  height: 100vh;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.logo {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  color: #165DFF;
}

.nav-menu {
  flex: 1;
  margin: 0 20px;
}

.header-actions {
  display: flex;
  align-items: center;
  width: 267px;
  gap: 12px;
}

.user-btn {
  display: flex;
  align-items: center;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
  overflow-y: auto;
}

.footer {
  padding: 10px 20px;
  height: auto;
  background-color: #fff;
  border-top: 1px solid #e5e7eb;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #86909c;
}

.footer-links a {
  margin-left: 15px;
  color: #86909c;
  text-decoration: none;
}

.footer-links a:hover {
  color: #165DFF;
}

.message-badge {
  --el-badge-font-size: 10px;
  --el-badge-min-width: 16px;
  --el-badge-height: 16px;
}

.nickname {
  margin-left: 5px;
}
</style>
