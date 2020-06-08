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

@Router.route('/dumpsters/stats')
export class DumpstersStats{
    static async get(ctx: Context) {
        let params = new URLSearchParams(ctx.request.url.split('?', 2)[1])
        
        const dateStart = new Date(Number(params.get('dateStart')))
        const dateEnd = new Date(Number(params.get('dateEnd')))
        
        ctx.response.body = await Dumpster.getGarbageDataWithinRange(dateStart, dateEnd) || {}
    }
}

@Router.route('/dumpster/:id/stats')
export class SpecificDumpsterStats{
    static async get(ctx: Context, id: any) {
        let params = new URLSearchParams(ctx.request.url.split('?', 2)[1])
        
        const dateStart = new Date(Number(params.get('dateStart')))
        const dateEnd = new Date(Number(params.get('dateEnd')))
        
        ctx.response.body = await Dumpster.getSpecificGarbageDataWithinRange(dateStart, dateEnd, id) || {}
    }
}
