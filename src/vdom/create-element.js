
export function createElement(tag, data = {}, ...children) {
    let key = data.key;
    if (key) {
        delete data.key
    }
    return vnode(tag, data, key, children, undefined)
}

export function createTextNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text)
}

/**
 * @description 描述的是真实的dom结构 对象
 * @param {*} tag div 标签
 * @param {*} data 属性
 * @param {*} key  diff key
 * @param {*} children  子节点
 * @param {*} text  文本
 * @return 专门产生虚拟节点
 */
function vnode(tag, data, key, children, text) {
    return {
        tag,
        data,
        key,
        children,
        text
    }
}



/**
 * @description 流程:
 *  将template转化成ast语法树-> 生成render方法(字符串拼接)-> 生成虚拟dom->真实的dom
 *  重新生成虚拟dom -> 更新dom
 * 
 */