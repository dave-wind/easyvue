import { nextTick } from "../util/next-tick";


let quene = []; //队列存放watcher
let has = {};



function flushSchedularQueue() {
    console.log("flushSchedularQueue--")
    quene.forEach(watcher => watcher.run());
    // 清空 队列 和 挂载对象
    quene = [];
    has = {};
}

export function queueWatcher(watcher) {
    const id = watcher.id;
    // 同一个watcher 需要过滤;
    if (!has[id]) {
        quene.push(watcher);
        has[id] = true;
        // 单线程 等同步执行完以后 callback, 在下一个事件队列 执行;
        nextTick(flushSchedularQueue, watcher)
    }
}