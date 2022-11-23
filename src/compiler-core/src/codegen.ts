export function generate(ast: any) {
    // createCodegenContext返回一个对象，里面有个 push 方法去拼接
    // const context = {
    //     code: "",
    //     push(source: any) {
    //         context.code += source;
    //     },
    // };
    const context = createCodegenContext();
    const { push } = context;
    push("return ");

    const functionName = "render";//一个 函数名
    const args = ["_ctx", "_cache"]; //参数
    const signature = args.join(", ");//将参数数组转成一个 string

    //然后开始拼接
    push(`function ${functionName}(${signature}){`);
    push("return ");
    //推入节点内容
    genNode(ast.codegenNode, context);
    push("}");

    return {
        code: context.code,
    };
}

function createCodegenContext(): any {
    const context = {
        code: "",
        push(source: any) {
            context.code += source;
        },
    };

    return context
}

function genNode(node: any, context: any) {
    const { push } = context;
    push(`'${node.content}'`);
}