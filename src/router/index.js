"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var path_1 = require("path");
// routing
exports["default"] = (function (app) {
    fs_1["default"].readdirSync(path_1["default"].resolve(__dirname)).forEach(function (file) {
        if (file === 'index.js')
            return;
        if (/\.map/.test(file))
            return;
        var route = require("./".concat(file))["default"];
        app.use(route.routes()).use(route.allowedMethods());
    });
});
