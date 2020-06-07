import * as deno from 'https://deno.land/std@0.53.0/http/server.ts'
import Router from './router.ts'


export default class Server {
    private readonly server: deno.Server
    readonly port: number

    constructor(port: number) {
        this.port = port
        this.server = deno.serve({port: port})
    }

    async serve() {
        for await (const req of this.server) {
            await Router.routeRequest(req)
        }
    }
}
