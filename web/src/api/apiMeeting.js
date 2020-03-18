import server from './server';
import url from './serverAPI.config';

export function meetingSearch(data){
    return server({
        url: url.meetingSearch,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function meetingSearchCertain(data){
    return server({
        url: url.meetingSearchCertain,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}


export function meetingSearchAll(data){
    return server({
        url: url.meetingSearchAll,
        method: 'get',
        dataType: "json",
        data: data || {}
    })
}

export function meetingSearch2(data){
    return server({
        url: url.meetingSearch2,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function meetingSearch3(data){
    return server({
        url: url.meetingSearch3,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function meetingAdd(data){
    return server({
        url: url.meetingAdd,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function meetingModify(data){
    return server({
        url: url.meetingModify,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function meetingDelete(data){
    return server({
        url: url.meetingDelete,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function meetingMembersAdd(data){
    return server({
        url: url.meetingMembersAdd,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function meetingMembersDelete(data){
    return server({
        url: url.meetingMembersDelete,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function meeting7Search(data){
    return server({
        url: url.meeting7Search,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function meetingAccept(data){
    return server({
        url: url.meetingAccept,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function meetingSignIn(data){
    return server({
        url: url.meetingSignIn,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function meetingReject(data){
    return server({
        url: url.meetingReject,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}