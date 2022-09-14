import { observe } from "./observer/index"
import Watcher from "./observer/watcher";
import { isObject, proxy } from "./util/index"
/**
 * 
 * @param {*} vm 传入实例
 * 初始化状态: 包含 props data computed watch (传入 Vue 里的 options 含有的都需要初始化)
 */
export function initState(vm) {

    const opts = vm.$options;

    if (opts.props) {
        initProps(vm);
    }

    if (opts.data) {
        initData(vm);
    }

    if (opts.methods) {
        initMethods(vm);
    }
    if (opts.computed) {
        initComputed(vm);
    }

    if (opts.watch) {
        initWatch(vm, opts.watch);
    }

}

function initProps() { }


// 初始化数据
function initData(vm) {

    let data = vm.$options.data;
    data = vm._data = typeof data == 'function' ? data() : data
    // 对象劫持, 用户改变了数据,希望可以监听到,得到通知 ==> 去更新视图View
    console.log("data--", data)

    //为零让用户更好的使用, 希望直接 vm.xx;  走代理模式
    for (let key in data) {
        // 代理 _data 转移取值
        proxy(vm, '_data', key)
    }




    // MVVM模式 数据变化 驱动视图变化
    // 用 Object.defineProperty 给给对象的属性增加get 和set方法
    observe(data)

}

function initMethods() { }

function initComputed() { }

// watch 原理是通过Watcher 实现
function initWatch(vm, watch) {
    for (let key in watch) {
        const handler = watch[key]
        if (Array.isArray(handler)) {
            for (let i = 0; i < handler.length; i++) {
                // 用户传递的是数组 循环 依次创建
                createWatcher(vm, key, handler[i])
            }
        } else {
            createWatcher(vm, key, handler)
        }
    }
}

/** watch 几种方式
 watch: {
            name: [{
                handler: 'handler',
                sync: true
            }],
            name2(newVal,oldVal) {

            },
            name: {
                handler(newVal,oldVal){

                },
                sync: true // 每次改变都会触发
            }
        },

 */


function createWatcher(vm, key, handler, options) {

    // 参数的格式化操作

    if (isObject(handler)) {
        // options 默认是{} 放到 ioptions
        options = handler;
        // 对象取 handler
        handler = handler.handler;
    }

    if (typeof handler === 'string') {
        // 从methods 上找 方法
        handler = vm.$options.methods[handler]
    }
    //

    // watch原理 是基于$watch的
    return vm.$watch(key, handler, options)
}


export function stateMixin(Vue) {
    Vue.prototype.$watch = function (exprOrFn, cb, options) {
        const vm = this;
        // 表示当前是用户自己写的 watcher; watcher是分 渲染watcher 和 用户自写的watcher的
        options.user = true;
        new Watcher(vm, exprOrFn, cb, options);
    }
}