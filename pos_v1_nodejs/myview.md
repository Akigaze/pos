## 1.测试文件和程序入口配置在package.json文件中
```json
//模块主文件
"main": "app.js",
//模块的脚本
    "scripts": {
    //启动程序的的npm命令
    "start": "node app.js",
    //测试程序的npm命令，run-tests.js为测试主程序文件
    "test": "node run-tests.js"
    }
```

## 2.run-tests.js中加载jasmine测试配置文件
```javascript
jasmine.loadConfigFile('spec/support/jasmine.json');
```
`spec/support/jasmine.json` 为测试配置文件
## 3.jasmine.json测试配置文件
```json
{
  //测试源文件的目录
  "spec_dir": "spec",
  //测试源文件
  "spec_files": [
    "**/*[tT]est.js"
  ],
  "helpers": [
    "helpers/**/*.js"
  ],
  "stopSpecOnExpectationFailure": false,
  "random": false
}
```
## 4.引用模块函数
使用 **require** 函数指定模块(不带扩展名)，从中提取函数并保存为变量
```javascript
const {calTotalAndSaved,calSubtotal}=require("../main/main");
```
## 5.导出模块函数
指定要到处的函数，导出到 **module.exports**
```javascript
module.exports={loadAllItems,loadPromotions};
```