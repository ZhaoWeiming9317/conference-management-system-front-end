import server from './server';
import url from './serverAPI.config';

export function formAdd(data){
    return server({
        url: url.formAdd,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function formDelete(data){
    return server({
        url: url.formDelete,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function formModify(data){
    return server({
        url: url.formModify,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function formSearch(data){
    return server({
        url: url.formSearch,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function formSearchPage(data){
    return server({
        url: url.formSearchPage,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function formDetail(data){
    return server({
        url: url.formDetail,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}