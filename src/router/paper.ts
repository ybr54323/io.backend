import Router from 'koa-router'
import { PrismaClient } from '.prisma/client'

const prisma = new PrismaClient()

const router = new Router({ prefix: '/paper' })

const generateCode = (count: number): string => {
    const strs = '0123456789'
    let code = ''
    while (count > 0) {
        code += strs[Math.round(Math.random() * strs.length)]
        count--;
    }
    return code;
}

router.get('/', async (ctx, next) => {
    const code = ctx.cookies.get("code") || null;
    if (!code) {
        return ctx.redirect('/paper/random')
    }
    ctx.redirect(`/paper/${code}`)
}).get('/random', async (ctx, next) => {
    let fin = false;
    let code = '';
    while (!fin) {
        code = generateCode(4);
        console.log("code: ", code)
        let existedPaper = await prisma.paper.findUnique({
            where: {
                code
            }
        });
        if (existedPaper === null) {
            await prisma.paper.create({
                data: {
                    code,
                    content: "请输入内容"
                }
            })
            fin = true
        }
    }
    ctx.redirect(`/paper/${code}`)
}).get('/:code', async (ctx, next) => {
    const code = ctx.params.code || ''
    if (!code) ctx.redirect('/paper/');
    const existedPaper = await prisma.paper.findUnique({
        where: {
            code
        }
    });
    if (existedPaper === null) await prisma.paper.create({ data: { code } })
    ctx.cookies.set("code", code, {
        httpOnly: true,
        sameSite: true,
        overwrite: true,
    })
    await ctx.render('paper', { content: existedPaper?.content || '' })
}).post('/', async (ctx, next) => {
    const { content = '' } = ctx.request.body;
    const code = ctx.cookies.get("code");
    if (!code) return await ctx.redirect('/paper/random');
    await prisma.paper.update({
        where: { code },
        data: { content }
    });
    ctx.body = { code: 0 }
})



export default router;