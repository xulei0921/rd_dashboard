import { ElMessage } from "element-plus";

// 生成带当前时间的文件名
const generateTimeFileName = (prefix='报表导出', suffix='.xlsx') => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${prefix}_${year}${month}${day}_${hours}${minutes}${seconds}${suffix}`
}

export const downloadFile = (blob, headers = {}) => {
    try {
        if (!(blob instanceof Blob)) {
            // console.log(typeof blob)
            throw new Error('无效的文件数据，不是 Blob 类型')
        }
        // 从响应头提取文件名
        let fileName
        const disposition = headers['content-disposition'] || headers['Content-Disposition']
        // console.log(disposition)

        if (disposition) {
            console.log(2)
            // 匹配 filename*=UTF-8''xxx 格式（兼容中文编码）
            const match = disposition.match(/filename\*=UTF-8''(.*)/);
            if (match && match[1]) {
                fileName = decodeURIComponent(match[1]);
            }
        }

        if (!fileName) {
          fileName = generateTimeFileName('报表导出', '.xlsx')
        }

        // 创建下载链接
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click()

        // 清理资源
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        ElMessage.success('导出成功');
    } catch (error) {
        console.error('下载处理失败', error);
        ElMessage.error('文件下载失败，请重试');
    }
}

export const handleExportError = (errorBlob) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const errorMsg = JSON.parse(reader.result).message || '导出失败';
      // console.log(reader)
      ElMessage.error(errorMsg);
      resolve(errorMsg);
    };
    reader.readAsText(errorBlob); // 将Blob转为文本
  });
};