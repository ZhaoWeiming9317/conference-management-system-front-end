import server from './server';
import url from './serverAPI.config';

export function deviceAdd(data){
    return server({
        url: url.deviceAdd,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function deviceDelete(data){
    return server({
        url: url.deviceDelete,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function deviceModify(data){
    return server({
        url: url.deviceModify,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function deviceSearch(data){
    return server({
        url: url.deviceSearch,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function deviceFloorSearch(data){
    return server({
        url: url.deviceFloorSearch,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function deviceSearchPage(data){
    return server({
        url: url.deviceSearchPage,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function deviceDetail(data){
    return server({
        url: url.deviceDetail,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}