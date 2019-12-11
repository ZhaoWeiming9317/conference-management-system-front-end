/**
 * 将List中项中对象为空的对象值变为placeholder中的值
 * @param {array} list 待处理列表
 * @param {string} placeholder 将Null值更换为此值
 */
export const execListWithNull  = (list, placeholder = '-') => {
    return list.map((item)=>{
        for (let index in item) {
          if (item[index] === "null" || item[index] === "") {
            item[index] = placeholder
          }
        }
        let key = item.userId
        item.key = key
        return item
    })
}
/**
 * 给list的每一个项赋予一个key值
 * @param {string} attr 将list['attr']的值设为key的值，如果没有，就用默认的递增数
 */
export const execListWithKey  = (list, attr = '') => {
    if (attr !== '' || !list[attr]) {
        let i = 0
        return list.map((item)=>{
            item.key = i++
            return item
        })
    } else {
        return list.map((item)=>{
            item.key = item[attr]
            return item
        })
    }
}