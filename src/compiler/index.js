import { parseHTML } from "./parser-html.js"
import { generate } from "./generate.js";


export function compileToFunction(template) {
    console.log("compile", template)
    // 1.把html字符串 转为 ast语法树 
    let root = parseHTML(template)
    console.log('root---', root)



    // 2.把 ast语法树 生成最终的 render函数 就是字符串拼接(模版引擎)
    // <div id="app"><p>hello {{name}}</p> hello </div>
    // 将ast树,再次转化为 js语法 ,核心思路就是将模版转化为 下面字符串:
    // _c("div",{id:app},_c("p",undefined,_v('hello' + _s(name) )),_v('hello'))

    let code = generate(root)

    console.log("code--", code)

    // 所有 模版引擎实现: 都需要 new Function + with

    // render 函数 返回的就是 虚拟dom  且 _c, _s _v 创建的都是一个个虚拟dom
    let renderFn = new Function(`with(this){ return ${code}}`)


    return renderFn
}