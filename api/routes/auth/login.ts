import Router from '../../dino/router.ts'
import Context from '../../dino/context.ts'

@Router.route('/auth/login')
export default class Login {

    static async post(ctx: Context) {
        console.log(await ctx.request.body)
        const token = await ctx.request.token
        console.log(token ? token : 'No token')
        ctx.response.body = { message: 'Success', token: ctx.createJWT({'id': 0}) }
    }

}
