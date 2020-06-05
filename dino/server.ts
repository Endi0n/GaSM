import * as deno from 'https://deno.land/std@0.53.0/http/server.ts'
import Response from './response.ts'
import Router from './router.ts'


export default class Server {
    private readonly server: deno.Server
    readonly port: number
    readonly root: string

    constructor(port: number, root: string) {
        this.port = port
        this.root = root
        this.server = deno.serve({port: port})
    }

    async serve() {
        for await (const req of this.server) {
            let res = new Response()

            res.headers.set('Content-Type', 'application/json')

            let handler = Router.endpoints['get']['/404'] 
            if(req.method.toLowerCase() in Router.endpoints)
                handler = Router.endpoints[req.method.toLowerCase()][req.url] || Router.endpoints['default'][req.url] || 
                          Router.endpoints['get']['/404'] 
            
            let json = handler(req)

            res.body = JSON.stringify(json)

            req.respond(res)
        }
    }
}
