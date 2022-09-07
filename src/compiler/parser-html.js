const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // abc-aaa

const gnameCapture = `((?:${ncname}\\:)?${ncname})`; // <awdawd:awfwdw>

const startTagopen = new RegExp(`^<${gnameCapture}`); // 标签开头的正则 捕获的内容是标签名 

const endTag = new RegExp(`^<\\/${gnameCapture}[^>]*>`); // 匹配标签结尾的 </div>

// 匹配属性  id = "app"  id = 'app'  id = app 三种可能
//                 空格 + 非"'<>=       不捕获 空格 =
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)’+|([^\s"'=<>`]+)))?/;

const startTagclose = /^\s*(\/?)>/; // 匹配标签结束 空格 + /> 



export function parseHTML(html) {

    let root = null; // ast语法树
    let currentParent; // 标识当前父亲是谁
    const ELEMENT_TYPE = 1
    const TEXT_TYPE = 3
    let stack = []; // 主要用于看是否为正常的 关闭的标签; 栈结构 先进后出


    // ast html节点
    function createASTElement(tagName, attrs) {
        return {
            tag: tagName,
            type: ELEMENT_TYPE,
            children: [],
            attrs,
            parent: null
        }
    }

    function start(tagName, attrs) {
        // 遇到开始标签,就创建一个ast元素
        let element = createASTElement(tagName, attrs);
        // 如果一上来没有root
        if (!root) {
            root = element;
        }
        currentParent = element;
        stack.push(element);

    }

    function chars(text) {
        text = text.replace(/\s/g, '');
        if (text) {
            currentParent.children.push({
                text,
                type: TEXT_TYPE
            })
        }
    }


    // <div><p></p></div>  [div]
    function end(tagName) {
        //  栈结构 当遇到结尾的标签 就弹出
        let element = stack.pop();
        currentParent = stack[stack.length - 1];
        // 如果父节点存在,即可标明父子关系
        if (currentParent) {
            // 实现一个树的父子 关系
            element.parent = currentParent;
            currentParent.children.push(element);
        }

    }


    // 不停解析html字符串
    while (html) {
        let textEnd = html.indexOf("<");

        // 解析开始标签 + 属性
        // 默认开头的标签 <
        if (textEnd == 0) {
            // 如果索引为0,肯定是一个标签, 开始标签 || 结束标签
            let startTagMatch = parseStartTag() // 获取到匹配的标签名, tagName 属性attr

            if (startTagMatch) {
                // console.log("startTagMatch---", startTagMatch)
                start(startTagMatch.tagName, startTagMatch.attrs)
                // 匹配到开头标签, continue 跳过循环 继续下一个循环
                continue
            }
            let endTagMatch = html.match(endTag);
            // 匹配到 </ 结束标签
            if (endTagMatch) {
                // 删除结束标签, 比如 删除 <div> </div> 
                advance(endTagMatch[0].length)
                end(endTagMatch[1]) // 2 解析结束标签
                continue
            }
        }

        // 文本
        let text;
        // 匹配到 <p 之前的文本
        if (textEnd >= 0) {
            text = html.substring(0, textEnd)
        }
        if (text) {
            advance(text.length);
            chars(text); // 3 解析文本
        }


    }
    // 截掉n之前的字符串
    function advance(n) {
        html = html.substring(n)
    }

    // 遍历 html 字符串 生成 节点+属性
    function parseStartTag() {
        /**
         * 1.匹配 tagName
         */

        // 匹配出来 是一个 数组  ['<div','div', index:0, input: "<div id ="app"",xxxx]
        let start = html.match(startTagopen)
        if (start) {
            // 设置一个对象来接受
            const match = {
                tagName: start[1],
                attrs: []
            }
            // eg: <div . length, 为了把html 字符串 前面匹配过的 截掉
            advance(start[0].length)

            /**
             * 2.匹配 属性
            */
            let end, attr
            // 没有匹配到结束标签 且有 属性 attr
            while (!(end = html.match(startTagclose)) && (attr = html.match(attribute))) {
                advance(attr[0].length);// 属性去掉
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5]
                })
            }
            if (end) {
                // console.log("end---", end)
                advance(end[0].length)
                return match
            }
        }
    }

    // 返回根节点
    return root;
}


/**
 * 匹配规则 html 为 语法树结构:
 * <div id="app">
     <p>hello</p>
   </div>
 *
 * 
let root = {
    tag: 'div',
    attrs: [{ name: 'id', value: 'app' }],
    parent: null,
    type: 1, // nodeType 节点为1  属性为2 文本为3
    children: [{
        tag: 'p',
        attrs: [],
        parent: root,
        children: [
            {
                text: 'hello',
                type: 3
            }
        ]
    }]
}
 * 
 *   
 */