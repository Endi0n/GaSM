import Router from '../../dino/router.ts'
import Context from '../../dino/context.ts'

@Router.route('/auth/register')
export default class Register {

    static async post(ctx: Context) {
        console.log(await ctx.request.body)
        ctx.response.body = { message: 'Success' }
    }

}
