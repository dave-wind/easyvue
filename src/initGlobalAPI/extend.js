import { mergeOptions } from "../util/index";

export default function initExtend(Vue) {

    // 为什么要有子类和父类 new Vue (Vue构造函数)
    // 创造子类 继承与父类 扩展的时候都扩展到自己的属性上
    Vue.extend = function (extendOptions) {
        console.log('extendOptions--', extendOptions)
        const Sub = function Vuecomponent() {
            // 这里this 指向子组件; 子组件初始化, 但是子类 没有_init方法 
            // 所以需要继承
            this._init(options)
        }
        // Object.create 实现继承;但有缺陷;会改变其构造函数
        Sub.prototype = Object.create(this.prototype)
        // 把 default prototype 唯一属性 constructor 指向 其本身;
        Sub.prototype.constructor = Sub;

        // 合并options 方法
        Sub.options = mergeOptions(
            this.options,
            extendOptions
        )
        // 子类继承父类;
        // 还可以拓展 mixin use ???
        return Sub;
    }


}