import Koa from 'koa'
import Router from 'koa-router'

import logger from 'koa-logger'
import json from 'koa-json'
import bodyParser from 'koa-bodyparser'
import cors from 'koa-cors'

import { PrismaClient, View } from '@prisma/client'

const prisma = new PrismaClient()


const app = new Koa();
const router = new Router()

router.get('/', async (ctx, next) => {
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


router.post('/', async (ctx, next) => {
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

app.use(json())
app.use(logger())
app.use(bodyParser())


app.use(cors({
    origin: '*.github.io'
}))

app.use(router.routes()).use(router.allowedMethods())


app.listen(3000, () => {
    console.log("started")
})