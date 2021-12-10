import Router from 'koa-router'
import { PrismaClient } from '.prisma/client'
const router = new Router({ prefix: '/note' })
const prisma = new PrismaClient();

// 做一个记事板
router.get('/:path', async (ctx, next) => {
    let path = ctx.params.path;

    const note = await prisma.note.findUnique({
        where: {
            path
        }
    })
    // if (note) {
    //     await prisma.note.create({
    //         data: {
    //             path,
    //         }
    //     })
    // }
    // else {

    // }

    console.log(note)


})
