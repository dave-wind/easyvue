import { pushTarget, popTarget } from "./dep.js"
import { queueWatcher } from "./schedular"


let id = 0;
class Watcher {
    constructor(vm, exprOrFn, callback, options) {
        this.id = id++;
        this.vm = vm;
        this.callback = callback;
        // 默认情况下 只有 渲染 watcher options 为true
        this.options = options;

        // 所以 user 在渲染watcher下 为 undefined 这里要区分 渲染watcher 和 用户user

        this.user = options.user;

        if (typeof exprOrFn === 'function') {
            this.getter = exprOrFn;

        } else { //  可能是字符串 watcher: {'obj.name.name'}

            // 将getter方法 封装成 取vm实例下的取值函数
            this.getter = function () {
                let patch = exprOrFn.split(".");
                let val = vm;
                // 循环取值 xxx.xx.x 
                for (let i = 0; i < patch.length; i++) {
                    val = val[patch[i]];
                }
                return val;
            }
        }

        // dep 相关
        this.depsId = new Set() // 唯一性 去重
        this.deps = [];

        // watcher 需要存的 上一次的值;
        this.value = this.get();

    }
    addDep(dep) {
        let id = dep.id;
        // 解决watcher 重复存放的问题
        if (!this.depsId.has(id)) {
            this.depsId.add(id);
            this.deps.push(dep);

            // 调用 dep 方法;把watcher 存到dep里 (避免重复存放)
            dep.addSub(this);
        }
    }

    get() {
        // 依赖收集; watcher 和 user watcher 都会从这里收集依赖
        pushTarget(this); // 把watcher 存起来
        let val = this.getter.call(this.vm); // 渲染watcher的执行 || 用户写的watcher执行

        popTarget(); // 移除watcher

        return val;
    }

    // 有可能会被 多次调用 update 所以要过滤
    update() {
        // 同步watcher 取消 queue 直接执行; 改变几次 调用几次;
        if (this.sync) {
            this.run();
        } else {
            // 等待着
            queueWatcher(this);
        }


    }

    run() {
        let oldValue = this.value; // 第一次渲染的值
        let newValue = this.get();

        // 更新value
        this.value = newValue;

        // 表示当前是user写的 watcher
        if (this.user) {
            this.callback.call(this.vm, newValue, oldValue)
        } else { // 内部渲染watcher
            this.get();
        }

    }
}

export default Watcher