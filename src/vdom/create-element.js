
import { isObject, isReservedTag } from "../util/index";

export function createElement(vm, tag, data = {}, ...children) {

    // ast -> render -> 调用
    let key = data.key;
    if (key) {
        delete data.key
    }

    // 原生标签的时候
    if (isReservedTag(tag)) {
        return vnode(tag, data, key, children, undefined)
    } else {

        // 从vm 实例上 找到组件的定义 
        // console.log("vm.$options.components--", vm.$options.components, tag)
        let Ctor = vm.$options.components[tag];
        console.log("组件----Ctor", Ctor)
        return createComponent(vm, tag, data, key, children, Ctor)

    }

}

function createComponent(vm, tag, data, key, children, Ctor) {
    // 如果传的是对象 需要 通过 extend 变成构造函数, 继承父组件方法和属性等
    if (isObject(Ctor)) {
        // 构建了当前组件这个类
        Ctor = vm.$options._base.extend(Ctor)
    }

    // 组件内部的生命周期
    data.hook = {
        init(vnode) {
            // 当前组件的实例, 虚拟节点上 componentInstance 表示的就是vue实例
            let child = vnode.componentInstance = new Ctor({ _isComponent: true });
            // 组件的挂载 
            child.$mount();
        }
    }

    let componentObj = {
        Ctor, // 组件的构造函数 方便子组件调用其他方法
        children // 子组件children 是插槽
    }

    // 组件内部会自动调用 extend; 创建虚拟节点; 组件是没有孩子children的 只有插槽
    return vnode(`vue-component-${Ctor.cid}-${tag}`, data, key, undefined, undefined, componentObj)
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
 * @componentOptions 组件的options 
 * @return 专门产生虚拟节点
 * 
 */
function vnode(tag, data, key, children, text, componentOptions) {
    return {
        tag,
        data,
        key,
        children,
        text,
        componentOptions
    }
}



/**
 * @description 流程:
 *  将template转化成ast语法树-> 生成render方法(字符串拼接)-> 生成虚拟dom->真实的dom
 *  重新生成虚拟dom -> 更新dom
 * 
 */