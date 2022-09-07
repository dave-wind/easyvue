import initMixin from "./mixin.js";

import { ASSETS_TYPE } from "./const.js";
import initAssetRegister from "./assets.js";
import initExtend from "./extend.js";

export function initGlobalAPI(Vue) {

    // 整合了所有的全局相关的内容
    Vue.options = {};
    initMixin(Vue)


    // 初始化全局过滤器,指令 组件; 都要挂载在 options 上
    ASSETS_TYPE.forEach(type => {
        Vue.options[type + 's'] = {}
    });

    Vue.options._base = Vue; // _base 是Vue的构造函数 本身

    // 注册 Extend 方法
    initExtend(Vue);


    initAssetRegister(Vue);


}