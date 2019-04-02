// 多入口出口处理
const path = require("path");
const fs = require("fs");
const htmlWebpackPlugin = require("html-webpack-plugin");
const pagesPath = path.resolve("./src");

var pageList = [];
function readPages() {
  fs.readdirSync(pagesPath).forEach(e => {
    var fullPath = pagesPath + "/" + e;
    if (e.includes("html")) {
      var baseName = e.slice(0, e.indexOf("."));
      pageList.push({
        entry: pagesPath + "\\js\\" + baseName + ".js",
        chunkName: baseName,
        template: pagesPath +'\\'+ e
      });
    }
  });
  return pageList;
}

// 入口
exports.getEntryPages = function() {
  return readPages().reduce((r, page) => {
    r[page.chunkName] = page.entry;
    return r;
  }, {});
};
//出口
exports.htmlPlugins = function() {
  var list = readPages().map(page => {
    var options = {
      filename: page.chunkName + ".html",
      template: page.template,
      chunks: [page.chunkName]
    };
    return new htmlWebpackPlugin(options);
  });
  return list;
};
