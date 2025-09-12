import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import useElementPlus from './plugins/element-plus'

const app = createApp(App)

// 使用插件
useElementPlus(app)

app.use(router)
app.use(store)

app.mount('#app')
