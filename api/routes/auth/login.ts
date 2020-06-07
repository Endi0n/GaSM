import Router from '../../dino/router.ts'
import Context from '../../dino/context.ts'

@Router.route('/auth/login')
export default class Login {

    static async post(ctx: Context) {
        console.log(await ctx.request.body)
        ctx.response.body = { message: 'Success' }
    }

}
