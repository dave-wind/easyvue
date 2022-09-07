import { mergeOptions } from "../util/index"

export default function initMixin(Vue) {
    // 生命周期的合并策略!!!
    Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin)
    }
}

   // Vue.mixin({
    //     a: 1,
    //     beforeCreate(a) {
    //     }
    // })

    // Vue.mixin({
    //     b: 2,
    //     beforeCreate(b) {
    //     }
    // })