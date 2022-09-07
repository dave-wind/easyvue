let id = 0;
class Dep {
    constructor() {
        this.id = id++;
        this.subs = [];
    }
    // 把 watcher 添加到 dep中
    addSub(watcher) {
        this.subs.push(watcher)
    }

    depend() {
        // this.subs.push(Dep.target);
        // 这里的 Dep.target 就是 watcher, 方法意思是把 Dep 添加到watcher里
        Dep.target.addDep(this);
    }

    notify() {
        // console.log("watcher this.subs--", this.subs)
        this.subs.forEach(watcher => watcher.update())

        // wathcer 更新完就被移除了
        // console.log("Dep.target-- notify after", Dep.target)
    }

}

Dep.target


// 栈
let stack = [];
export function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher)

}



export function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
}

export default Dep;
