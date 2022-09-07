// 渲染成真实dom
export function patch(oldVnode, vnode) {
    // 1.判断是更新还是渲染

    // 因为虚拟节点是 没有 nodeType的
    const isRealElement = oldVnode.nodeType

    if (isRealElement) {
        const oldElm = oldVnode; // app
        const parentElm = oldElm.parentNode // body

        let el = creareElm(vnode);
        parentElm.insertBefore(el, oldElm.nextSibling) // 紧跟app 组件之后,插入el

        parentElm.removeChild(oldElm) // 删除老的 app

        // 需要将渲染好的dom 返回
        return el;
    }
 

}
// 根据虚拟节点 创建 真实的 dom节点
// 递归创建
function creareElm(vnode) {
    let { tag, children, key, data, text } = vnode;
    if (typeof tag == 'string') {
        // 创建标签
        vnode.el = document.createElement(tag);
        // 把属性 也展示到 dom页面效果上
        updateProperties(vnode);

        // 递归子节点
        children.forEach(child => {
            // 把子节点 一个个 塞到 父节点里;递归 调用
            return vnode.el.appendChild(creareElm(child))
        })
    } else {
        // 虚拟dom 映射真实dom 方便后续更新操作
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}

// 更新属性
function updateProperties(vnode) {
    let newProps = vnode.data || [];
    let el = vnode.el

    // 循环添加样式 到dom el 上
    for (let key in newProps) {
        if (key == 'style') {
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName]
            }
        } else if (key === 'class') {
            el.className = newProps.class;
        } else {
            el.setAttribute(`${key}`, newProps[key])
        }
    }
}




/**
 * 注意:
 * 1.nextSibling 属性可返回某个元素之后紧跟的节点（处于同一树层级中）
 *
 *2 .Node.insertBefore(a,b) 在参考节点(b)之前插入一个拥有指定父节点的子节 a
 */