import Request from './request.ts'
import Response from './response.ts'
import DefaultErrorHandler from './default_error_handler.ts'


export default class Router {
    private static endpoints: Record<string, any> = { }
    private static errorHandler: any = DefaultErrorHandler


    static route(endpoint: string) {
        return function registerEndpoint(cls: any) {
            Router.endpoints[endpoint] = cls
        }
    }

    static errorsHandler(cls: any) {
        Router.errorHandler = cls
    }

    static middlewares(middlewares: Array<(callforward: (req: Request, ...args: any[]) => any, req: Request, ...args: any) => void>) {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            const originalFunc: (req: Request, ...args: any[]) => any = descriptor.value

            descriptor.value = (req: Request, ...args: any[]) => {
                middlewares.reverse()
                
                let finalCallee: (req: Request, ...args: any[]) => any = (req: Request, ...args: any[]) => middlewares[0](originalFunc, req, ...args)

                for (const middleware of middlewares.slice(1)) {
                    const callee = finalCallee
                    finalCallee = (req: Request, ...args: any[]) => middleware(callee, req, ...args)
                }

                return finalCallee(req, ...args)
            }
        }
    }

    static routeRequest(req: Request) {
        let res = new Response()

        res.headers.set('Content-Type', 'application/json')

        let json_response: any | null = null

        try {

            next_route:
            for (let [route_def, cls] of Object.entries(Router.endpoints)) {
                const route_def_split = route_def.split('/')
                const route_req_split = req.url.split('/')

                if (route_def_split.length != route_req_split.length) continue

                let route_params = []

                for (let i = 0; i < route_def_split.length; ++i) {
                    if (route_def_split[i].indexOf(':') === 0) {
                        // extracting route-params
                        route_params.push(route_req_split[i])
                        continue
                    }

                    if (route_def_split[i] !== route_req_split[i]) continue next_route
                    // ^ path doesn't match so we skip try another route
                }

                // At this point, the route matches, and we obtained the route-params

                let handler = cls[req.method.toLowerCase()] || cls['default']
                // ^ try specified method handler or resort to the default handler
                
                json_response = handler
                    ? handler(req, ...route_params)             // handler found
                    : Router.errorHandler.error501        
                    ? Router.errorHandler.error501(req)       // no handler found try 501 error handler
                    : Router.errorHandler.default(501, req)    // no 501 handler, try default error handler
                
                break  // route found
            }
            
            if (!json_response) {
                // If no route matched:

                json_response = Router.errorHandler.error404
                    ? Router.errorHandler.error404(req)       // try 404 error handler
                    : Router.errorHandler.default(404, req)    // no 404 handler, try default error handler
            }

        } catch (exception) {
            // Exception throwed

            json_response = Router.errorHandler.error505
                ? Router.errorHandler.error505(req, exception)        // try 505 error handler
                : Router.errorHandler.default(500, req, exception)     // no 505 handler, resort to default error handler
        }

        // return JSON response

        res.body = JSON.stringify(json_response!)  

        req.respond(res)
    }
}
