import * as deno from 'https://deno.land/std@0.53.0/http/server.ts'
import { decode } from 'https://deno.land/std/encoding/utf8.ts'
import Response from './response.ts'


export default class Request {
    #serverRequest: deno.ServerRequest
    #body: any | null

    constructor(serverRequest: deno.ServerRequest) {
        this.#serverRequest = serverRequest
    }

    private async parseBody() {
        this.#body = JSON.parse(decode(await Deno.readAll(this.#serverRequest.body)))
        return this.#body
    }

    get body(): Promise<any> {
        return (async () => this.#body || await this.parseBody())()
    }

    get url() {
        return this.#serverRequest.url
    }

    get method() {
        return this.#serverRequest.method
    }

    respond(response: Response) {
        return this.#serverRequest.respond(response)
    }
}
