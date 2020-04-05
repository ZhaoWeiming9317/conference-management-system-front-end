import axios from 'axios'
import { message } from 'antd'

//取消请求
let CancelToken = axios.CancelToken
axios.create({
    timeout: 15000// 请求超时时间
})
//开始请求设置，发起拦截处理
axios.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    if (localStorage.getItem('token')) {
        config.headers['Authorization'] = `user_id=${localStorage.getItem('user_id')};token=${localStorage.getItem('token')}`    
    } else {
        config.headers['Authorization'] = `user_id=${sessionStorage.getItem('user_id')};token=${sessionStorage.getItem('token')}`    
    }
    return config
}, error => {
    return Promise.reject(error)
})
// respone拦截器
axios.interceptors.response.use(
    response => {
        const res = response.data
        const status = response.status
        return res
    },
    error => {
        console.log("error", error)
            if (error.response) {
                switch (error.response.status) {
                    case 407:
                        message.warning('登录鉴权过期，请登录')
                        break
                    case 500:
                        message.error('系统错误')
                        break
                }
            }   
        return Promise.reject(error)
    }

)

export default axios