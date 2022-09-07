import { initMixin } from "./init";
import { renderMixin } from "./render";
import { lifecycleMixin } from "./lifecycle";
import { initGlobalAPI } from "./initGlobalAPI/index"



function Vue(options) {

    // 调用了 Vue 的 init 原型方法
    this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)


initGlobalAPI(Vue)

export default Vue;