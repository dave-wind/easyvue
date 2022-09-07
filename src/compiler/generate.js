import { upper } from "../util/index.js"

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g  // 匹配 {{}}


function genProps(attrs) {
    let str = '';
    // attrs 是数组 格式 eg: [{name:id,value: 'app'},{name:style,value: " color:red;fontSize:14; "}] 
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i]

        // style="color:red;font-size:14;" ===>  {style:{color: 'red'}}
        // style 特殊处理
        if (attr.name === 'style') {
            let obj = {};
            // attr.value =  color:red;font-size:14; ==> 转成 obj
            attr.value.split(";").forEach(item => {
                let [key, value] = item.split(":");
                // 处理特殊key名,eg: font-size ==> fontSize
                if (key.indexOf("-") > -1) {
                    // replace 第二参数 可以穿函数, 函数参数:(匹配到的值,第二个是捕获到的)
                    key = key.replace(/-(\w)/g, upper)
                }
                obj[key] = value;
            });
            // 改写 attr的 value
            attr.value = obj;
        }
        // 任何属性 key:value 形式 拼接; 每一个都接逗号
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}` // 最后一项 逗号不要
}


function genChildren(el) {
    let children = el.children;
    if (children && children.length > 0) {
        return `${children.map(c => gen(c)).join(',')}`
    } else {
        return false
    }
}


function gen(node) {
    // 递归匹配
    if (node.type == 1) {
        return generate(node)
    } else {

        // exec 正则循环匹配 会有问题 ,lastIndex问题
        // _v("a"+_s(name)+"b"+_s(age)+"c")

        let text = node.text; // eg: a {{name}} b {{age}} c
        let tokens = []; // 是用来存 每一个 text 比如 a, {{name}} 等
        let match, index;
        let lastIndex = defaultTagRE.lastIndex = 0; // 只要是全局匹配 就需要将lastIndex 每次调到0

        // 匹配不到 就为 null 结束循环
        while (match = defaultTagRE.exec(text)) {
            index = match.index;
            if (index > lastIndex) {
                // 截取字符串
                tokens.push(JSON.stringify(text.slice(lastIndex, index)));
            }
            tokens.push(`_s(${match[1].trim()})`);

            // 重新设置偏移量 = 匹配到的起始index + 匹配到的长度
            lastIndex = index + match[0].length;
        }
        // 如果没有匹配到最后, 直接把后面的全部push 到tokens里
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }
        console.log("tokens----", tokens);
        // 最后 全部 用 + 号 连起来
        return `_v(${tokens.join("+")})`
    }

}



export function generate(el) {

    let children = genChildren(el);

    let code = `_c("${el.tag}",
    ${el.attrs.length ? genProps(el.attrs) : 'undefined'}
    ${children ? `,${children}` : ""})`
    return code
}