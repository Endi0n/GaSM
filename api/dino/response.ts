import * as deno from 'https://deno.land/std@0.53.0/http/server.ts'

export default class Response implements deno.Response {
    headers: Headers = new Headers()
    status: number = 200
    body: any

    constructor() {
        this.headers.set('Access-Control-Allow-Origin', '*')
        this.headers.set('Content-Type', 'application/json')
    }
}
