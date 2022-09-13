import { initMixin } from "./init";
import { renderMixin } from "./render";
import { lifecycleMixin } from "./lifecycle";
import { initGlobalAPI } from "./initGlobalAPI/index"

// import {diffDemo} from "./diff-test";

function Vue(options) {

    // 调用了 Vue 的 init 原型方法
    this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)


initGlobalAPI(Vue)


// dif test
// diffDemo(Vue)

export default Vue;