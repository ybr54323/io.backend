import Koa from 'koa'
import https from 'https'
import enforceHttps from 'koa-sslify'
import fs from 'fs'
import logger from 'koa-logger'
import json from 'koa-json'
import bodyParser from 'koa-bodyparser'
import cors from 'koa-cors'
import routing from './router'

const app = new Koa();


app.use(enforceHttps())
app.use(json())
app.use(logger())
app.use(bodyParser())
app.use(cors({
    origin: ".*ybr54323.github.io"
}))
routing(app)

// app.listen(3000, () => {
//     console.log("started")
// })

const options = {
    key: fs.readFileSync('./ssl/api.io.ybr543.com.key'),
    cert: fs.readFileSync('./ssl/api.io.ybr543.com.pem')
};

https.createServer(options, app.callback()).listen(443, () => {
    console.log('443 started');
})