import babel from "@rollup/plugin-babel";
import serve from "rollup-plugin-serve";


const diff = {
    input: "./src/diff-test.js",
    output: {
        file: "dist/umd/vue.js",
        name: "Vue",
        format: "umd",
        sourcemap: true
    },
    plugins: [
        babel({
            exclude: "node_modules/**",
        }),
        process.env.ENV == "development" ? serve({
            open: true,
            openPage: "/public/diff.html",
            port: 3001,
            contentBase: "",
        }) : null
    ]
};

const config = {
    input: "./src/index.js",
    output: {
        file: "dist/umd/vue.js",
        name: "Vue",
        format: "umd",
        sourcemap: true
    },
    plugins: [
        babel({
            exclude: "node_modules/**",
        }),
        process.env.ENV == "development" ? serve({
            open: true,
            openPage: "/public/index.html",
            port: 3000,
            contentBase: "",
        }) : null
    ]
}

export default config