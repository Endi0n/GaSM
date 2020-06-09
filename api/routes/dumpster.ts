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
        
        const dateStart = new Date(Number(params.get('dateStart'))*1000)
        const dateEnd = new Date(Number(params.get('dateEnd'))*1000)
        
        ctx.response.body = await Dumpster.getGarbageDataWithinRange(dateStart, dateEnd) || {}
    }
}

@Router.route('/dumpster/:id/stats')
export class SpecificDumpsterStats {
    static async get(ctx: Context, id: any) {
        let params = new URLSearchParams(ctx.request.url.split('?', 2)[1])
        
        const dateStart = new Date(Number(params.get('dateStart'))*1000)
        const dateEnd = new Date(Number(params.get('dateEnd'))*1000)
        
        ctx.response.body = await Dumpster.getSpecificGarbageDataWithinRange(dateStart, dateEnd, id) || {}
    }
}

@Router.route('/dumpsters/stats/list')
export class DumpstersStatsList {
    static async get(ctx: Context) {
        let params = new URLSearchParams(ctx.request.url.split('?', 2)[1])

        const dateStart = new Date(Number(params.get('dateStart'))*1000)
        const dateEnd = new Date(Number(params.get('dateEnd'))*1000)
        const id = params.get('lastId')
        let ord = params.get('order') || 1
        if(ord == 'desc')
            ord = 0
        else
            ord = 1
        ctx.response.body = await Dumpster.getTableData(dateStart, dateEnd, id, ord) || []
    }
}