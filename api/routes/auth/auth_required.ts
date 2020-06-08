import Context from '../../dino/context.ts'
import RequestHandler from '../../dino/request_handler.ts'
import User from '../../models/user.ts'


export default async function authRequired(callforward: RequestHandler, ctx: Context, ...args: any[]) {
    const token = await ctx.request.token
    if (!token) {
        ctx.response.status = 403
        ctx.response.body = { status: 'error', error: 'Authentication required.' }
        return
    }

    callforward(ctx, await User.findById(token.userId), ...args)
}
