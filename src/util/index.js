export function isObject(data) {
    return typeof data === 'object' && data !== null
}


export function isNative(Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}


export function noop(a, b, c) { }

export const isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA));

export function def(data, key, value) {
    Object.defineProperty(data, key, {
        enumerable: false, // 不可枚举
        configurable: false, // 不可配置
        value
    })
}

export function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newValue) {
            vm[source][key] = newValue;
        }
    })
}

export function upper(all, letter) {
    return letter.toUpperCase();
}

const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed'
]

// 策略
let strats = {}
LIFECYCLE_HOOKS.forEach(hook => {
    // 根据key 执行 自定义函数
    strats[hook] = mergeHook
});

// 组件策略 
function mergeAssets(parentVal, childVal) {
    const res = Object.create(parentVal); // res.__proto__ = parentVal;

    if (childVal) {
        for (let key in childVal) {
            // 让组件 先找自己的局部组件,找不到根据原型链 网上找
            res[key] = childVal[key]
        }
    }
    return res;

}
// 所以全局组件 可以在任何地方用
strats.components = mergeAssets;


function mergeHook(parentVal, childVal) {
    if (childVal) {
        if (parentVal) {
            return parentVal.concat(childVal)
        } else { // 新的有,老的没有 生命周期 返回 数组格式
            return [childVal]
        }

    } else { // 没有子级 直接返回
        return parentVal;
    }
}


/**
 * @description: 合并对象 或其他类型
 * @param {*} parent 
 * @param {*} child 
 */
export function mergeOptions(parent, child) {
    const options = {};

    // 父是对象
    for (let key in parent) {
        mergeField(key)
    }

    for (let key in child) {
        // 如果已经合并过了,就不需要再合并了
        if (!parent.hasOwnProperty(key)) {
            mergeField(key)
        }
    }


    // 默认的合并策略 但有些属性 需要特殊的合并 生命周期的合并
    function mergeField(key) {
        // 如果你有 这个策略, 执行策略方法, 主要是用来处理生命周期; 因为其需要是一个数组 可一次执行
        if (strats[key]) {
            return options[key] = strats[key](parent[key], child[key])
        }


        if (typeof parent[key] == 'object' && typeof child[key] == 'object') {
            options[key] = {
                ...parent[key],
                ...child[key]
            }
        } else if (child[key] == null) {
            options[key] = parent[key];
        } else { // 父为null 子为obj
            options[key] = child[key]
        }
    }

    return options;

}


// 如果是原生标签 返回true
export const isReservedTag = (tagName) => {
    let str = 'p,div,span,input,button';
    let obj = {}
    str.split(",").forEach(tag => {
        obj[tag] = true
    })
    return obj[tagName]
}