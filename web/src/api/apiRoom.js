import server from './server';
import url from './serverAPI.config';

/**
 * 
 * @param {
    room_name: string
    country: string
    province: string
    city: string
    block: string
    building: string
    floor: string
    room_number: int
    room_volume: int
    mark: string} data 
 */
export function roomAdd(data){
    return server({
        url: url.roomAdd,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}
/**
 * 
 * @param {room_id: xxxx;} data 
 */
export function roomDelete(data){
    return server({
        url: url.roomDelete,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}


/**
 * 
 * @param {
    room_name: string
    country: string
    province: string
    city: string
    block: string
    building: string
    floor: string
    room_number: int
    room_volume: int
    mark: string} data 
 */
export function roomModify(data){
    return server({
        url: url.roomModify,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}
/**
 * 
 * @param {room_id: xxxx;} data 
 */
export function roomDetail(data){
    return server({
        url: url.roomDetail,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}
/**
 * 
 * @param {    room_name: xxxx;page: xxx(页数);volume：XXX} data 
 */

export function roomSearch(data){
    return server({
        url: url.roomSearch,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}
/**
 * 
 * @param {page: xxx(页数);volume：XXX} data 
 */
export function roomSearchPage(data){
    return server({
        url: url.roomSearchPage,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

export function roomBuildingSearch(data){
    return server({
        url: url.roomBuildingSearch,
        method: 'get',
        dataType: "json",
        data: data || {}
    })
}



export function roomFloorSearch(data){
    return server({
        url: url.roomFloorSearch,
        method: 'post',
        dataType: "json",
        data: data || {}
    })
}

