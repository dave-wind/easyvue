import { isObject, def } from "../util/index"
import { arrayMethods } from "./array.js";
import Dep from "./dep"


export function observe(data) {
    const isObj = isObject(data);
    if (!isObj) {
        return
    }
    return new Observer(data);
}

class Observer {
    constructor(value) {
        /** 给数组用的 */
        this.dep = new Dep();


        // value.__proto__.ob = this; // 给每一个监控过得对象依次增加set get 方法

        // 这里用数据存储器的方式 不让 该属性能枚举, 不然会死循环,因为存值是this,
        // 被枚举时候 会访问到this  会不断调用walk=>observerArray 等
        def(value, "__ob__", this);



        if (Array.isArray(value)) {
            // 如果是数组的话 并不会对索引进行观察,会导致性能问题,(数组里100个item 就要观察100次)
            // 而且用户很可能操作 索引, (最少别操作索引)
            // console.log("is Array")

            // 函数的劫持(代理),通过更改原型链上的 方法, arrayMethods内部再调用原生的方法 (push shift, unshift)
            value.__proto__ = arrayMethods;
            // 数组里放的对象 再监控
            this.observerArray(value)

        } else {
            // console.log("is object")
            this.walk(value)
        }

    }

    walk(data) {
        // 拿到所有的对象 key 进行深度遍历 设置 get set
        const keys = Object.keys(data);
        keys.forEach(key => {
            defineReactive(data, key, data[key])
        })
    }

    // 观察数组
    observerArray(value) {
        // 遍历数组每一项值, 非引用类型除外, 观察的是 每一个对象
        for (let i = 0; i < value.length; i++) {
            observe(value[i])
        }
    }
}

function dependArray(value) {
    for (let i = 0; i < value.length; i++) {
        let current = value[i]; // 数组中每一个都取出 收集依赖
        current.__ob__ && current.__ob__.dep.depend()
        if (Array.isArray(current)) { // 递归数组中的数组 依赖收集
            dependArray(current);
        }
    }
}

function defineReactive(data, key, value) {

    // 这个dep 是给对象使用的
    let dep = new Dep();

    /**
     * @observe :  对data里对象进行递归深度遍历观察; 其返回值是ovserver实例
     * @value: value可能是数组也可能是对象
     */
    let childOb = observe(value)

    /**
     * @数据描述器 
     * Object.defineProperty(obj,"newKey",{
     * get:function (){} | undefined,
     * set:function (value){} | undefined
     * configurable: true | false
     * enumerable: true | false
    });
     * @注意 当使用了getter或setter方法，不允许使用writable和value这两个属性
     * 
     */
    Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true, // 这里要设置为true 不然 vm里data里的对象展示不出来
        get() {
            if (Dep.target) { // 如果当前有watcher
                dep.depend(); // 表示要将watcher存起来

                // 收集数组的相关依赖
                if (childOb) {
                    childOb.dep.depend()

                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
            }

            return value
        },
        // 操作 去设置值 
        set(newValue) {
            // 监听变化
            console.log("监听变化")
            // 浅比较 相等 就不继续执行
            if (newValue == value) return
            // @注意!!! 如果用户直接修改 data 上的对象为一个新的对象,需要继续 observe
            observe(newValue)

            // 这里的 value 是闭包引用,直接修改即可
            value = newValue;

            dep.notify(); // 通知依赖的watcher 来更新
        }
    })
}