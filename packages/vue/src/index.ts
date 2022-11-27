export * from "@mini-vue-study/runtime-dom";
import { baseCompile } from "@mini-vue-study/compiler-core";
import * as runtimeDom from "@mini-vue-study/runtime-dom";
import { registerRuntimeCompiler } from "@mini-vue-study/runtime-dom";

function compileToFunction(template: any) {
    const { code } = baseCompile(template);
    const render = new Function("Vue", code)(runtimeDom);
    return render;
}

registerRuntimeCompiler(compileToFunction);