import Request from './request.ts'

export default class Router {
    
    public static endpoints:{[id: string]: Record<string, (req: Request) => any>} = { }


    static route(endpoint : string) {
        return function registerEndpoint(constructor : any) {
            const instance = new constructor()
            
            for(const method of Object.getOwnPropertyNames(constructor.prototype))
                if(endpoint != 'constructor'){
                    if(!(endpoint in Router.endpoints))
                        Router.endpoints[endpoint] = {}
                        
                    Router.endpoints[endpoint][method] = instance[method]
                }
        }
    }
}

