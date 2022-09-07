import { ASSETS_TYPE } from "./const";


// Vue上的方法
export default function initAssetRegister(Vue) {
    ASSETS_TYPE.forEach(type => {
        Vue[type] = function (id, definition) {

            if (type == 'component') {

                // 注册全局组件
                // 使用 extend 方法 将对象变为构造函数
                // 子组件可能也有Vue Component.component方法; 所以统一用父类调用
                // 不可以❌  definition = this.extend(definition)
                // this.options._base 永远指向的都是父类
                definition = this.options._base.extend(definition)

            } else if (type == 'filter') {

            } else if (type === 'directive') {

            }

            // Vue is this; 给Vue 挂上options
            this.options[type+'s'][id] = definition;
        }
    })
} 