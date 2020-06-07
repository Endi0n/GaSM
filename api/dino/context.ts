import * as deno from 'https://deno.land/std@0.53.0/http/server.ts'
import Request from './request.ts'
import Response from './response.ts'


export default class Context {
    readonly request: Request
    readonly response: Response

    constructor(serverRequest: deno.ServerRequest) {
        this.request = new Request(serverRequest)
        this.response = new Response()
    }
}