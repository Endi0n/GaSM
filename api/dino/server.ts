import * as deno from 'https://deno.land/std@0.56.0/http/server.ts'
import Router from './router.ts'
import Context from './context.ts'


export default class Server {
    private readonly server: deno.Server
    readonly port: number
    readonly secretKey: string

    constructor(port: number, secretKey: string) {
        this.port = port
        this.secretKey = secretKey
        
        this.server = deno.serve({port: port})
    }

    async serve() {
        for await (const req of this.server) {
            try {
                await Router.routeRequest(new Context(this, req))
            } catch (exception) {
                console.error(exception)
            }
        }
    }
}
