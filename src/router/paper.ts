import Router from 'koa-router'
import { PrismaClient } from '.prisma/client'

const prisma = new PrismaClient()

const router = new Router()

const generateCode = (count: number): string => {
    const strs = '0123456789'
    let code = ''
    while (count > 0) {
        code += strs[Math.floor(Math.random() * strs.length)]
        count--;
    }
    return code;
}


router.get('/', async (ctx, next) => {
    const code = ctx.cookies.get("code") || null;
    if (!code) {
        return ctx.redirect('/random')
    }
    ctx.redirect(`/${code}`)
})

router.get('/random', async (ctx, next) => {
    let fin = false;
    let code = '';
    while (!fin) {
        code = generateCode(4);
        // console.log("code: ", code)
        let existedPaper = await prisma.paper.findUnique({
            where: {
                code
            }
        });
        if (existedPaper === null) {
            console.log(code)
            await prisma.paper.create({
                data: {
                    code,
                    content: "请输入内容"
                }
            })
            fin = true
        }
    }
    ctx.redirect(`/${code}`)
})

router.get('/:code', async (ctx, next) => {
    const code = ctx.params.code || ''
    if (!code) ctx.redirect('/');
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
        signed: true,
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24
    })
    await ctx.render('paper', { content: existedPaper?.content || '' })
})

router.post('/paper', async (ctx, next) => {
    const { content = '' } = ctx.request.body;
    const code = ctx.cookies.get("code");
    if (!code) return await ctx.redirect('/random');
    await prisma.paper.update({
        where: { code },
        data: { content }
    });
    ctx.body = { code: 0 }
})



export default router;