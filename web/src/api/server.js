import axios from 'axios';
//取消请求
let CancelToken = axios.CancelToken
axios.create({
    timeout: 15000// 请求超时时间
})
//开始请求设置，发起拦截处理
axios.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    let requestName = config.method === 'post'? config.data.requestName : config.data.requestName
    //判断，如果这里拿到上一次的requestName，就取消上一次的请求
    if(requestName) {
        if(axios[requestName] && axios[requestName].cancel){
            axios[requestName].cancel()
        }
        config.cancelToken = new CancelToken(c => {
            axios[requestName] = {}
            axios[requestName].cancel = c
        })
    }
    return config
}, error => {
    return Promise.reject(error)
})
// respone拦截器
axios.interceptors.response.use(
    response => {
        const res = response.data;
 
        //这里根据后台返回来设置
        if (res.state === 1) {
            return res;
        } else {
            return res;
        }
    },
    error => {
        return Promise.reject(error)
    }
)
 
export default axios