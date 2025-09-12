import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 旧版本兼容方案：不单独导入locale，直接使用默认配置
// 彻底移除locale相关配置，避免路径和导出名称问题
export default function(app) {
  app.use(ElementPlus)  // 不传递locale选项，使用默认设置
}
