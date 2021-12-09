import Koa from 'koa'
import Router from 'koa-router'
import http from 'http'
import https from 'https'
import fs from 'fs'
import enforceHttps from 'koa-sslify'

import logger from 'koa-logger'
import json from 'koa-json'
import bodyParser from 'koa-bodyparser'
import cors from 'koa-cors'

import { PrismaClient, View } from '@prisma/client'

const prisma = new PrismaClient()


const app = new Koa();
const router = new Router()

router.get('/', async (ctx, next) => {
    console.log('origin: ', ctx.request.href)

    let views: View[] = [];
    try {
        views = await prisma.view.findMany();
    } catch (err: any) {
        ctx.body = {
            msg: err.msg || err.message
        }
    }

    ctx.body = { views }
    await next()
})

router.get('/view/total', async (ctx, next) => {
    let count = 0;
    try {
        count = await prisma.view.count();
    } catch (err: any) {
        ctx.body = {
            msg: err.msg || err.message
        }
    }

    ctx.body = { count }
    await next()
})


router.post('/view', async (ctx, next) => {
    try {
        await prisma.view.create({
            data: {
                ip: ctx.ip
            }
        });
    } catch (err: any) {
        ctx.body = {
            msg: err.msg || err.message
        }
    }

    ctx.body = { code: 0 }
    await next()
})

app.use(enforceHttps())
app.use(json())
app.use(logger())
app.use(bodyParser())

app.use(cors({
    origin(request) {
        return '*';
        // const origin = request.headers['referer'] || '';
        // const validOrigins = ['http://localhost:8080', "*.ybr54323.github.io.com"]
        // if (validOrigins.indexOf(origin) > -1) {
        //     return origin;
        // }
        // return origin;
    }
}))

app.use(router.routes()).use(router.allowedMethods())

// app.listen(3000, () => {
//     console.log("started")
// })
// http.createServer(app.callback()).listen(80, () => {
//     console.log('80 started')
// })

const options = {
    key: fs.readFileSync('./ssl/api.io.ybr543.com.key'),
    cert: fs.readFileSync('./ssl/api.io.ybr543.com.pem')
};

https.createServer(options, app.callback()).listen(443, () => {
    console.log('443 started')
})