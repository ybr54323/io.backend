"use strict";
exports.__esModule = true;
var koa_1 = require("koa");
var koa_logger_1 = require("koa-logger");
var koa_json_1 = require("koa-json");
var koa_bodyparser_1 = require("koa-bodyparser");
var koa_cors_1 = require("koa-cors");
var router_1 = require("./router");
var koa_views_1 = require("koa-views");
// import serve from 'koa-static'
var render = (0, koa_views_1["default"])('./src/views', { extension: 'pug' });
var app = new koa_1["default"]();
// app.use(serve('./public/'));
app.use(render);
app.use((0, koa_json_1["default"])());
app.use((0, koa_logger_1["default"])());
app.use((0, koa_bodyparser_1["default"])());
app.use((0, koa_cors_1["default"])({
    origin: "https://ybr54323.github.io"
}));
(0, router_1["default"])(app);
app.listen(3000, function () {
    console.log("started");
});
// const options = {
//     key: fs.readFileSync('./ssl/api.io.ybr543.com.key'),
//     cert: fs.readFileSync('./ssl/api.io.ybr543.com.pem')
// };
// app.use(enforceHttps())
// https.createServer(options, app.callback()).listen(443, () => {
//     console.log('443 started');
// })
