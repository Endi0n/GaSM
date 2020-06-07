import * as deno from 'https://deno.land/std@0.53.0/http/server.ts'

export default class Response implements deno.Response {
    headers: Headers = new Headers()
    body: any
}
