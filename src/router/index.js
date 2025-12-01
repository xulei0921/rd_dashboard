import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  // {
  //   path: '/projects',
  //   name: 'Projects',
  //   component: () => import('../views/Projects.vue')
  // },
  // {
  //   path: '/team',
  //   name: 'Team',
  //   component: () => import('../views/Team.vue')
  // },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/Reports.vue'),
    redirect: '/reports/workhour-list',
    children: [
      {
        path: '/reports/workhour-list',
        component: () => import('@/views/WorkHourList.vue')
      },
      {
        path: '/reports/task-summary',
        component: () => import('@/views/TaskSummary.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
