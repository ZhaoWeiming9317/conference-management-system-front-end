export function watch(data){
    return server({
        url: `/watch/${data.id}/${data.name}`,
        method: 'get',
        dataType: "json"
    })
}


export function publish(data){
    return server({
        url: `/publish/${data.namespace}`,
        method: 'get',
        dataType: "json"
    })
}