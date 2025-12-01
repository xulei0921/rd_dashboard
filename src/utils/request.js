import axios from "axios";
import { useProjectStore } from "@/store";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import router from "@/router";

// const baseURL = 'http://192.168.1.6:8077/api'

const baseURL = import.meta.env.VITE_APP_API_BASE_URL

// const baseURL = 'http://11.64.1.126:10001/api'

// const baseURL = '/api'

const instance = axios.create({
    // TODO 1. 基础地址，超时时间
    baseURL,
    timeout: 8000
})

// 请求拦截器
instance.interceptors.request.use(
    // (config) => {
    //     // TODO 2. 携带token
    //     const userStore = useUserStore()
    //     if (userStore.token) {
    //         config.headers.Authorization = userStore.token
    //     }
    //     return config
    // },
    // (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
    (res) => {
        // TODO 3. 处理业务失败
        // TODO 4. 摘取核心响应数据
        // if (res.data.code === 0) {
        //     return res
        // }
        // 处理业务失败，给错误提示，抛出错误
        // ElMessage.error({ message: res.data.message || '服务异常', type: 'error' })
        // return Promise.reject(res.data)
        return res.data
    },
    (err) => {
        // TODO 5. 处理401错误
        // 错误的特殊情况 => 401 权限不足 或 token 过期 => 拦截到登录
        // if (err.response?.status === 401) {
        //     router.push('/login')
        // }

        // 错误的默认情况 => 只要给提示
        ElMessage.error({ message: err.response.data.message || '服务异常', type: 'error' })
        // console.log(err)
        return Promise.reject(err)
    }
)

export default instance
export { baseURL }
