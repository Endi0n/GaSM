import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import Router from '../../dino/router.ts'
import Context from '../../dino/context.ts'
import User from "../../models/user.ts";

@Router.route('/auth/register')
export default class Register {

    static async post(ctx: Context) {
        const requestBody = await ctx.request.body
        
        let user = await User.findByEmail(requestBody.email)

        if (user) {
            ctx.response.status = 401
            ctx.response.body = { status: 'error', error: 'Email already registered.' }
            return
        }

        user = new User(requestBody.email, await bcrypt.hash(requestBody.password), requestBody.name, requestBody.surname, requestBody.phone, 
            requestBody.address, 2)

        user.save()
    }

}
