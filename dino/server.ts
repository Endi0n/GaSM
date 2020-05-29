import * as deno from 'https://deno.land/std@0.53.0/http/server.ts'
import Request from './request.ts'
import Response from './response.ts'

export default class Server {
    private readonly server: deno.Server
    readonly port: number
    readonly root: string
    readonly routes: Record<string, (req: Request) => void>

    constructor(port: number, root: string, routes: Record<string, (req: Request) => void>) {
        this.port = port
        this.root = root
        this.routes = routes

        this.server = deno.serve({port: port})
    }

    async serve() {
        for await (const req of this.server) {
            let res = new Response()

            res.headers.set('Content-Type', 'application/json')

            let handler = this.routes[req.url] || this.routes[404]

            let json = handler(req)

            res.body = JSON.stringify(json)

            req.respond(res)
        }
    }
}
