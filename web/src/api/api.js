import server from './server';
import url from './serverAPI.config';
 
//接口1方法
export function userLogin(data){
    return server({
        url: url.userLogin,
        method: 'post',
        dataType: "json",
        data: data
    })
}
 
//接口2方法
export function userRegist(data){
    return server({
        url: url.userRegist,
        method: 'post',
        dataType: "json",
        data: data
    })
}
