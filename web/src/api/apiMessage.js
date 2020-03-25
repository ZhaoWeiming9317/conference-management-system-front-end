import server from './server';
import url from './serverAPI.config';

export function watch(data){
    console.log('data',data)
    return server({
        url: `${url.watch}/${data.id}/${data.name}`,
        method: 'get',
        dataType: "json"
    })
}


export function publish(data){
    return server({
        url: `${url.publish}/${data.namespace}`,
        method: 'get',
        dataType: "json"
    })
}

export function informAll(data){
    return server({
        url: `${url.informAll}`,
        method: 'get',
        dataType: "json"
    })
}

export function informFirst (data){
    return server({
        url: `${url.informFirst}`,
        method: 'get',
        dataType: "json"
    })
}

export function messageSearch (data){
    return server({
        url: `${url.messageSearch}`,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}


export function messageHaveRead (data){
    return server({
        url: `${url.messageHaveRead}`,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function messageAllHaveRead (data){
    return server({
        url: `${url.messageAllHaveRead}`,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

