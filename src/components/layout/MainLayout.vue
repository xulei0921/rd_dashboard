<template>
  <el-container class="main-container">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <!-- 移动端使用下拉菜单按钮 -->
      <el-button
        class="mobile-menu-btn"
        :icon="MoreFilled"
        size="small"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      ></el-button>

      <div class="logo">
        <el-icon :size="24" class="mr-2 title-logo"><Grid /></el-icon>
        <span class="title">研发管理驾驶舱</span>
      </div>
      
      <el-menu 
        :default-active="getActiveTopMenu" 
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
            <el-avatar class="mr-2"><img src="https://picsum.photos/id/1001/200/200" alt="用户头像"></el-avatar>
            <span class="nickname">admin</span>
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

    <!-- 移动端导航菜单 -->
    <!-- <el-drawer
      v-model="isMobileMenuOpen"
      direction="left"
      :with-header="false"
      class="mobile-drawer"
    >
    <el-menu
      :default-active="activeRoute"
      mode="vertical"
      class="mobile-nav-menu"
      @select="handleMobileMenuSelect"
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
  </el-drawer> -->
    
    <!-- 主内容区 -->
    <el-main class="main-content">
      <el-alert
        v-if="isShowAlert"
        title="刷新成功"
        type="success" 
        center 
        show-icon 
        class="refreshAlert"
        :closable="false"
        :auto-close="2000"
        @close="isShowAlert = false"
      ></el-alert>
      <router-view />
    </el-main>
    
    <!-- 页脚 -->
    <el-footer class="footer" style="z-index: 100;">
      <div class="footer-content">
        <p>© 2025 软件研发管理平台 | 数据每30分钟同步一次</p>
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
import { useAppStore } from '@/store'
import { 
  User, Files, UserFilled, Document, 
  Refresh, Bell, 
  Grid, Menu, MoreFilled
} from '@element-plus/icons-vue'
// import { Alert } from 'element-plus'

const router = useRouter()
const route = useRoute()

// 状态
const timeRange = ref('month')
const getActiveTopMenu = computed(() => {
  const currentPath = route.path

  // 定义所有顶部菜单的路由前缀
  const topMenuRoutes = [
    { prefix: '/', index: '/' },
    { prefix: '/projects', index: '/projects' },
    { prefix: '/team', index: '/team' },
    { prefix: '/reports', index: '/reports' }
  ]

  // 遍历匹配，返回第一个符合条件的顶部菜单索引
  for (const menu of topMenuRoutes) {
    if (currentPath === menu.prefix || currentPath.startsWith(`${menu.prefix}/`)) {
      return menu.index
    }
  }
  return ''
})
const isShowAlert = ref(false)
const isMobileMenuOpen = ref(false)

const appStore = useAppStore()

// 方法
const handleMenuSelect = (index) => {
  router.push(index)
}

// 移动端菜单选择处理
const handleMobileMenuSelect = (index) => {
  router.push(index)
  isMobileMenuOpen.value = false
}

const handleRefresh = () => {
  // 刷新数据的逻辑
  appStore.triggerRefresh() // 触发刷新信号
  console.log('刷新数据')
  isShowAlert.value = true
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
  padding: 0px;
  background-color: #f5f7fa;
  overflow-y: auto;
}

.refreshAlert {
  /* position: absolute; */
  position: fixed;
  width: 150px;
  left: 50%;
  transform: translate(-50%);
  z-index: 1;
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

/* 移动端菜单按钮 - 默认隐藏 */
.mobile-menu-btn {
  display: none;
}

/* 移动端抽屉菜单 */
.mobile-drawer {
  --el-drawer-width: 100%
}

.mobile-nav-menu {
  /* padding-top: 20px; */
}

/* 响应式布局 - 手机端 */
@media (max-width: 768px) {
  /* 显示移动端菜单按钮，隐藏桌面端菜单 */
  .mobile-menu-btn {
    display: block;
    /* position: absolute;
    left: 20px; */
  }

  .nav-menu {
    display: none;
  }

  /* 调整logo样式 */
  .logo {
    /* justify-content: center; */
    flex: 1;
  }

  .logo .title-logo {
    display: none;
  }

  .logo .title {
    font-size: 14px;
    margin-left: 3px;
  }

  /* 调整头部操作区 */
  .header-actions {
    width: auto;
  }
  
  .nickname {
    display: none; /* 隐藏用户名 */
  }
  
  .user-btn .mr-2 {
    margin-right: 0 !important;
  }
  
  /* 调整主内容区内边距 */
  .main-content {
    padding: 10px;
  }
  
  /* 调整页脚布局为垂直排列 */
  .footer-content {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  
  .footer-links {
    display: flex;
    gap: 15px;
  }
  
  .footer-links a {
    margin-left: 0;
  }
  
  /* 调整时间选择器大小 */
  .el-select.mr-2 {
    width: 70px;
  }
  
  /* 调整刷新提示位置 */
  .refreshAlert {
    width: 120px;
    font-size: 14px;
  }
}
</style>
