export function transform(root: any, options: any) {
    //这里传入的 options 就是在外部定义了如何转换
    // transform(ast, {
    //     nodeTransforms: [plugin],
    // });
    //然后调用下面这个方法返回一个对象，里面有根树和转换的方法
    const context = createTransformContext(root, options);
    //遍历 ast 语法树
    traverseNode(root, context);
}

function createTransformContext(root: any, options: any): any {
    const context = {
        root,
        nodeTransforms: options.nodeTransforms || [],
    };

    return context;
}

function traverseNode(node: any, context: any) {
    const nodeTransforms = context.nodeTransforms;
    for (let i = 0; i < nodeTransforms.length; i++) {
        //取出外部传入的转换方法，传入的是一个数组，然后每项都可以去转换节点
        const transform = nodeTransforms[i];
        //拿到转换方法，传入节点去转换
        transform(node);
    }

    //如果有子节点，那就继续去调用traverseNode。这里面就会递归调用
    traverseChildren(node, context);
}
function traverseChildren(node: any, context: any) {
    const children = node.children;

    if (children) {
        for (let i = 0; i < children.length; i++) {
            const node = children[i];
            traverseNode(node, context);
        }
    }
}