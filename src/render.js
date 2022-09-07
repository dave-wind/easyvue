import { createElement, createTextNode } from "./vdom/create-element"
export function renderMixin(Vue) {

    // this 从实例上取值, 因为上面的 _c,_v,_s 都是vm实例上的方法
    // _c 创建元素虚拟节点
    // _v 创建文本虚拟节点
    // _s  JSON.stringify

    // 所有实例都会 共用 原型上的方法
    Vue.prototype._c = function () {
        return createElement(...arguments);
    }

    Vue.prototype._v = function (text) {
        return createTextNode(text);
    }
    Vue.prototype._s = function (val) {
        return val === null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val)
    }


    Vue.prototype._render = function (vnode) {
        const vm = this;

        const { render } = vm.$options;


       return render.call(vm); // 去实例上 取值
    }
}