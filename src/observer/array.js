
/**
 * @Object.create 用来进行基于原型链的继承
 * 用户操作 vm._data.arr.push 就会在 重写的 arrayMethods 中找方法
 * value.__proto__ = arrayMethods 
 * 如果 arrayMethods 找不到任何方法就会基于原型链向上找
 * arrayMethods.__proto__ = oldArrayMethods
 */
let oldArrayMethods = Array.prototype
export let arrayMethods = Object.create(oldArrayMethods)

// 都会改变 原数组 , slice 不会
const methods = [
    "push",
    "shift",
    "unshift",
    "pop",
    "sort",
    "splice",
    "reverse"
]

methods.forEach(method => {
    // 先调用 重写的arr 方法 AOP 切片
    arrayMethods[method] = function (...args) {
        // 再里面调用 原生的数组方法
        const result = oldArrayMethods[method].apply(this, args)

        let insert // 当前用户插入的元素
        let ob = this.__ob__;

        switch (method) {
            case "push":
            case "unshit":
                insert = args; // 类数组 es6 ...args 参数
                break;
            case "splice":
                insert = args.slice(2) // arr.splice(0,1,{name:1})
            default:
                break;
        }
        // 当新添对象的话 继续 观察 
        if (insert) {
            ob.observerArray(insert)
        }


        //  如果用户调用了 数组方法 就会通知当前的dep 去更新
        ob.dep.notify();

        return result
    }

})


/**
 * @总结:
 * @Object.create 原型链继承
 * @AOP 切片编程方法
 */