import { isNative, isIOS, noop } from "../util/index";


let callbacks = [];
let waiting = false;

function flushCallback() {
    waiting = false;
    const copies = callbacks.slice(0);
    // 置空
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
        copies[i]();
    }
}



let timerFunc;

if (typeof Promise !== 'undefined') {
    const p = Promise.resolve();
    timerFunc = function () {
        p.then(flushCallback)
        if (isIOS) {
            setTimeout(noop)
        }
    }

} else if (typeof MutationObserver !== 'undefined') {
    let counter = 1;
    const observer = new MutationObserver(flushCallback);
    const textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
        characterData: true
    });
    timerFunc = function () {
        counter = (counter + 1) % 2;
        textNode.data = String(counter);
    }

} else if (typeof setImmediate !== 'undefined') {
    timerFunc = () => {
        setImmediate(flushCallback)
    }
} else {
    timerFunc = () => {
        setTimeout(flushCallback, 0)
    }
}



// 项目初始化的时候 ,代码里写的 set属性, 或者用户自己执行$nextTick 都会往队列里塞cb;  这里需要拦截,因为代码里面会循环调用 队列里的 callback;不然会多次调用
export function nextTick(cb, ctx) {
    let _resolve;

    // 队列 push 只要有 就往里 push;
    function fun() {
        if (cb) {
            cb.call(ctx)
        } else if (_resolve) {
            _resolve(ctx) // 如果是promise 就执行
        }
    }
    callbacks.push(fun);



    // 这里为了避免 异步函数 还没 被调用完 一种节流机制
    if (waiting === false) {
        waiting = true;
        // 执行并清空
        timerFunc()
    }

    // 当没有cb 可以提供Promise形式
    /**
     * vm.$nextTick().then(() => { })
     */
    if (!cb && typeof Promise !== 'undefined') {
        // console.log("参数---", Array.prototype.slice.apply(arguments));
        return new Promise(resolve => {
            _resolve = resolve
        })
    }
}
