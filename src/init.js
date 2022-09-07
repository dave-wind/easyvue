import { initState } from "./state";

import { compileToFunction } from "./compiler/index";

import { mountComponent, callHook } from "./lifecycle";

import { mergeOptions } from "./util/index"

import { nextTick } from "./util/next-tick";

export function initMixin(Vue) {

    Vue.prototype._init = function (options) {

        //  数据的劫持
        const vm = this;
        // Vue.options
        // vm.$options = options;


        /**
         * this.$options 指代的是用户传递的属性
         * 将用户传递的 和全局的Options 合并
         * 因为 init 可能会被子组件继承 或者子组件初始化调用, 所以用 vm.constructor.options, 
         * 当被 子类继承了以后 ,constructor 指向的就是子类了
         */


        vm.$options = mergeOptions(vm.constructor.options, options)

        callHook(vm, 'beforeCreate');

        // 初始化状态
        initState(vm) // 分割代码的写法

        callHook(vm, 'created');


        // 如果用户传入el 需要渲染templete
        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this;
        const options = vm.$options;
        // 取dom
        el = document.querySelector(el)

        /**
         * options 模版字段 优先级:
         * render 优先级最高 
         * template
         * el
         * 如果没有 options.render字段
         */
        if (!options.render) {
            let template = options.template // 取出模版
            if (!template && el) {
                template = el.outerHTML
            }
            const render = compileToFunction(template)
            // 将template 转化为 render方法 vue1.0 是字符串正则  vue2.0 是虚拟dom
            options.render = render;
        }
        // options.render()

        // 渲染当前的组件,挂载这个组件
        mountComponent(vm, el);
    }

    // 用户调用的 nextTick
    Vue.prototype.$nextTick = nextTick;
}