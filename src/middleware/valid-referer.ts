import Koa from 'koa'
export default () => {
    return (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
        const referer = ctx.request.headers.referer || ''
        if (!referer) {
            ctx.body = {
                code: 403,
            }
            return;
        }
        if (!/ybr54323.github.io/g.test(referer)) {
            ctx.body = {
                code: 403,
            }
            return;
        }
        next();
    }
}