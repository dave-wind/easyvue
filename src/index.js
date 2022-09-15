import { initMixin } from "./init";
import { renderMixin } from "./render";
import { lifecycleMixin } from "./lifecycle";
import { initGlobalAPI } from "./initGlobalAPI/index"
import { stateMixin } from "./state";

// import {diffDemo} from "./diff-test";

function Vue(options) {

    // 调用了 Vue 的 init 原型方法
    this._init(options)
}
// init 数据劫持 合并options
initMixin(Vue)

renderMixin(Vue)

lifecycleMixin(Vue)


initGlobalAPI(Vue)


// $watcher 声明
stateMixin(Vue);


// dif test
// diffDemo(Vue)

export default Vue;