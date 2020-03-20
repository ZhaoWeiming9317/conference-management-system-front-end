export function deBounce(func, wait=500) {
    let timeOut = null
    return function (...args) {
      clearTimeout(timeOut);//一定要清除定时器
      timeOut = setTimeout(() => {
        func(...args)
      }, wait)
    }
  }