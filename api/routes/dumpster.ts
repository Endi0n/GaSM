import Router from '../dino/router.ts'
import Context from '../dino/context.ts'
import Dumpster from '../models/dumpster.ts'


@Router.route('/dumpsters')
export class Dumpsters {
    static async get(ctx: Context) {
        ctx.response.body = (await Dumpster.getAllActiveDumpsters())?.map((x: any) => ({ id: x.id, ...x }))
    }
}

@Router.route('/dumpster/:id')
export class SpecificDumpster {
    static async get(ctx: Context, id: any) {
        const dumpster = await Dumpster.findById(id)
        
        ctx.response.body = {
            id: dumpster?.id,
            garbageTypes: await dumpster?.garbageTypes,
            ...dumpster,
        }
    }
}
