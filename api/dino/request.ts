import * as deno from 'https://deno.land/std@0.56.0/http/server.ts'
import { decode } from 'https://deno.land/std/encoding/utf8.ts'
import Server from './server.ts'
import Response from './response.ts'
import { validateJwt } from "https://deno.land/x/djwt/validate.ts"


export default class Request {
    #server: Server
    #serverRequest: deno.ServerRequest
    #body: any | null
    #token: any | null
    readonly params: URLSearchParams

    constructor(server: Server, serverRequest: deno.ServerRequest) {
        this.#server = server
        this.#serverRequest = serverRequest
        this.params = new URLSearchParams(serverRequest.url.split('?', 2)[1])
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

    private async parseToken() {
        const authorization = this.#serverRequest.headers.get('Authorization')
        if (!authorization) return null

        const authorizationSplit = authorization.split(' ')
        if (authorizationSplit.length != 2) return null

        if (authorizationSplit[0].toLocaleUpperCase() !== 'BEARER')
            return null

        const jwt = authorizationSplit[1]

        const token = await validateJwt(jwt, this.#server.secretKey)
        if (!token.isValid) return null

        this.#token = token.payload

        return this.#token
    }

    get token(): any {
        return (async() => this.#token ? this.#token : await this.parseToken())()
    }

    respond(response: Response) {
        return this.#serverRequest.respond(response)
    }
}
