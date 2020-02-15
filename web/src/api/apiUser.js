import server from './server';
import url from './serverAPI.config';

 
export function userLogin(data){
    return server({
        url: url.userLogin,
        method: 'post',
        dataType: "json",
        data: data
    })
}
/**
 * 注册接口， 也可以用来管理员添加用户
 * 
 */
export function userRegist(data){
    return server({
        url: url.userRegist,
        method: 'post',
        dataType: "json",
        data: data
    })
}

/**
 * 搜索指定页的用户信息
 * @param { username: string  page: int（第几页） volume:int  (每页的容量)} data  
 */
export function userAdminSearch(data){
    return server({
        url: url.userAdminSearch,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}
/**
 * 获取指定页数用户信息
 * @param {page: int（第几页）  volume:int  (每页的容量)} data  
 */
export function userAdminSearchPage(data){
    return server({
        url: url.userAdminSearchPage,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}
/**
 * 管理员删除用户
 * @param {username: string} data  
 */
export function userAdminDelete(data){
    return server({
        url: url.userAdminDelete,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}
/**
 * 管理员修改用户 以及 用户自己修改自己的信息
 * @param {    ​        
       username: string name: string gender: string phone: string email: string
    ​	organization: string  department: string  position: string  password: string  role: int
} data  
 */
export function userModifyInfo(data){
    return server({
        url: url.userModifyInfo,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}
/**
 * 获取用户信息
 * @param {username: string} data  
 */
export function userShowInfo(data){
    return server({
        url: url.userShowInfo,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

/**
 * 获取用户信息
 * @param {user_id: string} data  
 */
export function userAdminSearchCertain(data){
    return server({
        url: url.userAdminSearchCertain,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}


export function userLoginVerification(data) {
    return server({
        url: url.userLoginVerification,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function userLoginExit(data) {
    return server({
        url: url.userLoginExit,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}