import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import Router from '../../dino/router.ts'
import Context from '../../dino/context.ts'
import User from "../../models/user.ts";

@Router.route('/auth/login')
export default class Login {

    static async post(ctx: Context) {
        const requestBody = await ctx.request.body
        const [email, password] = [requestBody.email, requestBody.password]

        let user = await User.findByEmail(email)
        if (!user) {
            ctx.response.status = 401
            ctx.response.body = { status: 'error', error: 'Email not registered.' }
            return
        }

        if (!(await bcrypt.compare(password, user.password))) {
            ctx.response.status = 401
            ctx.response.body = { status: 'error', error: 'Wrong password.' }
            return
        }

        const jwt = ctx.createJWT({'user_id': user.id})

        ctx.response.body = { status: 'success', token: jwt }
    }

}
