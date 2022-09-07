import { pushTarget, popTarget } from "./dep.js"
import { queueWatcher } from "./schedular"


let id = 0;
class Watcher {
    constructor(vm, exprOrFn, callback, options) {
        this.id = id++;
        this.vm = vm;
        this.callback = callback;
        this.options = options;
        this.getter = exprOrFn;

        // dep 相关
        this.depsId = new Set() // 唯一性 去重
        this.deps = [];

        this.get();

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
        pushTarget(this); // 把watcher 存起来
        this.getter(); // 渲染watcher的执行

        popTarget(); // 移除watcher
    }

    // 有可能会被 多次调用 update 所以要过滤
    update() {
        // 等待着
        // this.get()
        // console.log("update---------")
        queueWatcher(this);
    }

    run() {
        this.get();
    }
}

export default Watcher