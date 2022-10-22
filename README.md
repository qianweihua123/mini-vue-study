
# mini-vue-study
学习 vue3 的源码
yarn add typescript --dev 安装到 dev 环境
npx tsc --init 创建一个 ts 环境 生成tsconfig.json文件

yarn add jest @type/jest --dev  生成 d.ts文件，让 ts 识别 jest 里面的方法 生成tsconfig.json文件 types:['jest']



scripts中配置 test 命令的时候执行 jest yarn jest

执行测试的时候 jest 识别一些语法的时候需要安装 babel
如果需要让 jest 识别 ts 语法也需要安装 yarn add --dev @babel/preset-typescript 去支持 ts

yarn test 文件名 的时候会检测匹配的文件名执行