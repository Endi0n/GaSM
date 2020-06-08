import * as deno from 'https://deno.land/std@0.53.0/http/server.ts'
import { makeJwt, Jose, Payload } from "https://deno.land/x/djwt/create.ts"
import Server from './server.ts'
import Request from './request.ts'
import Response from './response.ts'


export default class Context {
    readonly server: Server
    readonly request: Request
    readonly response: Response

    constructor(server: Server, serverRequest: deno.ServerRequest) {
        this.server = server
        this.request = new Request(server, serverRequest)
        this.response = new Response()
    }

    createJWT(payload: Payload) {
        const header: Jose = {
            alg: "HS256",
            typ: "JWT",
        }

        const key = this.server.secretKey

        payload['iat'] = new Date().getTime()

        return makeJwt({ header, payload, key })
    }
}
