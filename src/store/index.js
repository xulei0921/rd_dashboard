import { createPinia, defineStore } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

// 创建 Pinia 实例
const pinia = createPinia()
pinia.use(persist)

export default pinia

export const useAppStore = defineStore('app', {
    state: () => ({
        refreshTrigger: 0
    }),
    actions: {
        triggerRefresh() {
            this.refreshTrigger++  // 通过修改值触发响应式更新
        }
    }
})

export * from './project'
export * from './employee-work-hours'
export * from './team'
