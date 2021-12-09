import Koa from 'koa'
import Router from 'koa-router'
import { PrismaClient, View } from '@prisma/client'
const prisma = new PrismaClient();
const router = new Router({ prefix: '/view' })

// 只有github.io页面才能调
const validReferer = () => {
    return async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
        const referer = ctx.headers['referer'] || ctx.headers['Referer'] || '';
        if (referer !== 'https://ybr54323.github.io') return ctx.body = { code: 403 };
        await next();
    }
}

router.use(validReferer())

router
    .get('/', async (ctx, next) => {
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
    .get('/total', async (ctx, next) => {
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
    .post('/', async (ctx, next) => {
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

export default router