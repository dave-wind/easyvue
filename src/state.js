import { observe } from "./observer/index"
import { proxy } from "./util/index"
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
        initWatch(vm);
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

function initWatch() { }
