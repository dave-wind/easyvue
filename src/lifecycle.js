import Watcher from "./observer/watcher";

import { patch } from "./vdom/patch";

export function mountComponent(vm, el) {
    const options = vm.$options;
    vm.$el = el; // 真实的dom 元素


    callHook(vm, 'beforeMount');




    // Watcher 就是用来渲染的页面的
    // vm._render 通过解析render方法 渲染出虚拟dom
    // vm._update 通过虚拟dom 创建真实的dom
    // 渲染页面
    let updateComponent = () => { // 无论渲染还是更新都会执行
        // 1.返回虚拟dom: vm._render()

        // 2. 把虚拟dom 生成真实的dom, 只有第一次 转成ast 后面都是对比
        vm._update(vm._render())
    }

    // 如何渲染? 通过 渲染watcher 每个组件都有一个watcher;
    //  默认渲染Watcher 不需要回掉函数, 而实例 vm.$watch(()=>{})有
    new Watcher(vm, updateComponent, () => { }, true) // true 表示这是一个渲染wather

    callHook(vm, 'mounted');
}


export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this;
        console.log("vnode---", vnode)

        const prevVnode = vm._vnode; // 保存上一次虚拟节点为了实现对比

        // 挂载在实例上 , 每new 一个实例, vm都会一直存在
        vm._vnode = vnode; // 真实渲染内容

        // 第一次渲染
        if (!prevVnode) {
            // 通过虚拟节点 渲染真实的dom, 去替换 真实的el
            vm.$el = patch(vm.$el, vnode);
        }else {
            // 拿到保存的上一次 真实内容 去对比
            vm.$el =  patch(prevVnode, vnode);
        }


    }
}


export function callHook(vm, hook) {
    const handlers = vm.$options[hook];

    // 发布 收集到的 生命周期函数
    if (handlers) { // 找到对应的钩子 执行
        for (let i = 0; i < handlers.length; i++) {
            // 传递this 指向问题 
            handlers[i].call(vm);
        }
    }
}