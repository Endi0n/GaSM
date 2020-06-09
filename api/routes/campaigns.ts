import Router from '../dino/router.ts'
import Context from '../dino/context.ts'
import Campaign from '../models/campaign.ts'

@Router.route('/campaigns')
export default class Campaigns {

    static async get(ctx: Context) {
       ctx.response.body = await Campaign.findPosts()
    }

}
