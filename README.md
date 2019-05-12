## 如何使用
```bash
$ yarn install
$ npm start

## 如何分析bundle
1. 生成stat.json文件:
   npm run build:stat
2. 全局安装分析工具，这里以webpack-bundle-analyzer为例:  
   tnpm install -g webpack-bundle-analyzer
3. 分析bundle:  
   npm run analyzer

