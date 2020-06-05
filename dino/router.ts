import Request from './request.ts'

export default class Router {
    
    public static endpoints:{[id: string]: Record<string, (req: Request) => any>} = {
        'get' : {},
        'post' : {},
        'put' : {},
        'delete' : {},
        'copy' : {},
        'head' : {},
        'default' : {}
    }

    static route(endpoint : string) {
        return function registerEndpoint(constructor : any) {
            const instance = new constructor()
            for(const [method] of Object.entries(Router.endpoints))
                if(typeof instance[method] === 'function')
                    Router.endpoints[method][endpoint] = instance[method]
        }
    }
}

