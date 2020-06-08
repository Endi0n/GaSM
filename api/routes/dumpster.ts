import Router from '../dino/router.ts'
import Context from '../dino/context.ts'
import Dumpster from '../models/dumpster.ts'


@Router.route('/dumpsters')
export class Dumpsters {
    static async get(ctx: Context) {
        ctx.response.body = { dumpsters: await Dumpster.getAllActiveDumpsters() }
    }
}

@Router.route('/dumpster/:id')
export class SpecificDumpster {
    static async get(ctx: Context, id: any) {
        ctx.response.body = await Dumpster.findById(id)
    }
}