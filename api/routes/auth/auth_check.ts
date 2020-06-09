import Router from '../../dino/router.ts'
import Context from '../../dino/context.ts'


@Router.route('/auth/check')
export default class AuthCheck {

    static async get(ctx: Context) {
        ctx.response.body = {
            status: (await ctx.request.token) ? 'authenticated' : 'unauthenticated'
        }
    }

}
