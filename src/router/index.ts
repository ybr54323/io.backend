import fs from 'fs'
import path from 'path'
import Koa from 'koa'
// routing
export default (app: Koa) => {
    fs.readdirSync(path.resolve(__dirname)).forEach(file => {
        if (file === 'index.js') return
        if (/\.map/.test(file)) return
        const route = require(`./${file}`).default
        app.use(route.routes()).use(route.allowedMethods())
    })
}