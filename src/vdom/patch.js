// 渲染成真实dom
export function patch(oldVnode, vnode) {
    // 1.判断是更新还是渲染
    debugger
    if (!oldVnode) {
        // 这个是组件的挂载 又叫 空挂载  empty mount (likely as component) 
        console.log("组件vnode---", vnode)
        return createElm(vnode)
    } else {
        // 因为虚拟节点是 没有 nodeType的
        const isRealElement = oldVnode.nodeType

        // 真实dom
        if (isRealElement) {
            const oldElm = oldVnode; // app
            const parentElm = oldElm.parentNode // body

            let el = createElm(vnode);
            parentElm.insertBefore(el, oldElm.nextSibling) // 紧跟app 组件之后,插入el

            parentElm.removeChild(oldElm) // 删除老的 app

            // 需要将渲染好的dom 返回
            return el;

        } else {
            // 如果标签不一样 直接把自身替换掉,为新虚拟节点真实的dom
            if (oldVnode.tag !== vnode.tag) {
                // createElm(vnode) 生成最新的dom 去替换老的 el
                oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
            }

            // 如果没有标签, 只是文本, 内容不一致的话
            if (!oldVnode.tag) {
                if (oldVnode.text !== vnode.text) {
                    oldVnode.el.texContent = vnode.text;
                }
            }

            // 标签一致 且不是文本; 修改属性

            // 让旧dom节点 赋值给 新的虚拟节点 el (复用)
            let el = vnode.el = oldVnode.el;
            // 更新属性
            updateProperties(vnode, oldVnode.data);


            // 比对子节点
            let oldChildren = oldVnode.children || [];
            let newChildren = vnode.children || [];
            console.log("oldChildren---", oldChildren)
            // 新老都有儿子, 需要比对里面儿子
            if (oldChildren.length > 0 && newChildren.length > 0) {
                updateChildren(el, oldChildren, newChildren);

            } else if (newChildren.length > 0) {

                // 新的有孩子,老的没孩子 直接将孩子虚拟节点转化为真实节点 插入即可;
                for (let i = 0; i < newChildren.length; i++) {
                    let child = newChildren[i];
                    // createElm 虚拟节点
                    el.appendChild(createElm(child));
                }

            } else if (oldChildren.length > 0) {
                // 老的有孩子, 新的没有孩子; 直接置空
                el.innerHTML = '';
            }

        }
    }

}

function isSameVnode(oldVnode, newVnode) {
    return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
}


function makeIndexByKey(children) {
    let map = {}
    children.forEach((item, index) => {
        if (item.key) {
            map[item.key] = index; //根据key创建映射表
        }
    })
    return map
}

// 比对新老子节点 vue 采用双指针方式
function updateChildren(parent, oldChildren, newChildren) {

    // 第一个指针指向oldVnode 开头
    let oldStartIndex = 0;
    let oldStartVnode = oldChildren[0];
    let oldEndIndex = oldChildren.length - 1;
    let oldEndVnode = oldChildren[oldEndIndex];

    // 第二个指针指向 newVnode 开头
    let newStartIndex = 0;
    let newStartVnode = newChildren[0];
    let newEndIndex = newChildren.length - 1;
    let newEndVnode = newChildren[newEndIndex];


    // 暴力比对 用的 把老的vnode 做成以key为键的对象

    let map = makeIndexByKey(oldChildren);

    // 在比对过程中 新老虚拟几点 有一方循环完毕 就结束
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {

        //在老指针移动过程中 可能会遇到 我们设置的undefined的情况 就跳过
        if (!oldStartVnode) {
            oldStartVnode = oldChildren[++oldStartIndex];
        } else if (!oldEndVnode) { // 反向操作
            oldEndVnode = oldChildren[--oldEndIndex]
        }
        // 优化向后插入的情况
        if (isSameVnode(oldStartVnode, newStartVnode)) {
            // 如果是同一节点 就需要比对这个元素的属性; 递归深度比较
            patch(oldStartVnode, newStartVnode);
            // 循环完 下一次 跟进
            oldStartVnode = oldChildren[++oldStartIndex];
            newStartVnode = newChildren[++newStartIndex];

            // 优化向前插入的情况
        } else if (isSameVnode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode)
            oldEndVnode = oldChildren[--oldEndIndex];
            newEndVnode = newChildren[--newEndIndex];
        }
        // 头移尾 A移动到了最后
        /**
         * A B C D
         * B C D A
         */
        else if (isSameVnode(oldStartVnode, newEndVnode)) {
            patch(oldStartVnode, newEndVnode)
            // 把A元素 移动到 旧vnode最后一个元素下一个的 前面;
            parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
            // 移动完 结束本次循环
            oldStartVnode = oldChildren[++oldStartIndex];
            newEndVnode = newChildren[--newEndIndex];

            // 尾移头
        } else if (isSameVnode(oldEndVnode, newStartVnode)) {
            patch(oldEndVnode, newStartVnode);
            // 把旧vnode 最后一个 移动到 最前面
            parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
            oldEndVnode = oldChildren[--oldEndIndex];
            newStartVnode = newChildren[++newStartIndex]
        } else {

            // 暴力比对
            // 现根据老节点key,做一个映射表,拿新的虚拟节点去映射表查找,如果可以查到,则进行移动(移到头指针前面位置)如果找不到就在头指针插入新元素)
            // 拿到移动到索引
            let moveIndex = map[newStartVnode.key];
            if (!moveIndex) { // 在旧vnode里没有 就再前插入
                parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);

            } else { // 需要复用
                // 这种情况是 头,尾节点都不一样 乱序情况下,在映射表中查找到了,则直接将元素移走
                let moveVnode = oldChildren[moveIndex]; // 所以要拿到这个需要移动的dom
                // 为了避免循环塌陷,还要移动完以后, 设置为空
                oldChildren[moveIndex] = undefined;
                parent.insertBefore(moveVnode.el, oldStartVnode.el);// 放在头指针前面
                // 标签一致还要比较子元素
                patch(moveVnode,newStartVnode)
            }
            // 最后 移动指针 准备下次循环
            newStartVnode = newChildren[++newStartIndex];
        }

    }

    // 新vnode 数量 大于 旧vnode
    if (newStartIndex <= newEndIndex) {

        for (let i = newStartIndex; i <= newEndIndex; i++) {

            // 正常情况下 向后找元素 到最后一位 为null 如果向前插入;  newChildren[newEndIndex + 1] 为首元素, 取其eldom元素
            let insertNode = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;
            if (insertNode == null) {
                // 将新增元素 直接进行插入
                // parent.appendChild(createElm(newChildren[i]));
                parent.insertBefore(createElm(newChildren[i], null))
            } else {
                // 向前插入元素, 从尾巴开始比对 向左移动 
                /**
                 *     A B C D
                 *  
                 *   E A B C D     
                 */
                console.log("parent--", newChildren[newEndIndex + 1])
                parent.insertBefore(createElm(newChildren[i]), insertNode)
            }
        }
    }

    // 删除旧dom的一些 操作
    if (oldStartIndex <= oldEndIndex) {
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            let child = oldChildren[i];
            if (child !== undefined) {
                console.log("child.el------", child.el)
                parent.removeChild(child.el);
            }
        }
    }

}



function createComponent(vnode) {
    // 创建组件的实例
    let i = vnode.data;
    if ((i = i.hook) && (i = i.init)) {
        // 执行 组件内部自定义 声明周期
        i(vnode)
    }
    if (vnode.componentInstance) {
        return true
    }
}



// 根据虚拟节点 创建 真实的 dom节点
// 递归创建
export function createElm(vnode) {
    let { tag, children, key, data, text } = vnode;
    if (typeof tag == 'string') {

        // 实例化组件
        if (createComponent(vnode)) {
            return vnode.componentInstance.$el;
        }


        // 创建标签
        vnode.el = document.createElement(tag);
        // 把属性 也展示到 dom页面效果上
        updateProperties(vnode);

        // 递归子节点
        children.forEach(child => {
            // 把子节点 一个个 塞到 父节点里;递归 调用
            return vnode.el.appendChild(createElm(child))
        })

    } else {
        // 虚拟dom 映射真实dom 方便后续更新操作
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}

// 更新属性
function updateProperties(vnode, oldProps = {}) {
    let newProps = vnode.data || {};
    let el = vnode.el;

    // 如果在dom上 老的属性有,新的属性没有,在真实dom上将这个属性 直接删除掉
    let newStyle = newProps.style || {}
    let oldStyle = oldProps.style || {};

    // 特殊处理 style的
    for (let key in oldStyle) {
        if (!newStyle[key]) {
            el.style[key] = ''
        }
    }

    // 处理普通属性
    for (let key in oldProps) {
        if (!newProps[key]) {
            el.removeAttribute(key);
        }
    }

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