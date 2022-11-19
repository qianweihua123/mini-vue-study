
module.exports = {
    presets: [
        ['@babel/preset-env', {targets: {node: 'current'}}],
        '@babel/preset-typescript',
    ], //以我当前的 node 版本去转换 ,让 jest 识别 ts
};