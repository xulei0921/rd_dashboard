import request from '@/utils/request'

export const getBusiness = () => {
    return request.get('/business/statistics')
}