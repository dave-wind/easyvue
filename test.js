const compiler = require("vue-template-compiler");

// r就是ast
let r = compiler.compile(`<div style="color:red" id ="app"> hello {{name}}</div>`)


console.log(r.render);