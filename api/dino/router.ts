import Context from './context.ts'
import RequestHandler from './request_handler.ts'
import DefaultErrorHandler from './default_error_handler.ts'


type Middleware = (callforward: RequestHandler, ctx: Context, ...args: any[]) => Promise<void>


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

    static middleware(middlewares: Array<Middleware> | Middleware) {
        let middlewares_arr: Middleware[] = (middlewares instanceof Array) ? middlewares : [ middlewares ]

        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            const originalFunc: RequestHandler = descriptor.value

            descriptor.value = async (ctx: Context, ...args: any[]) => {
                middlewares_arr.reverse()
                
                let finalCallee: RequestHandler = async (ctx: Context, ...args: any[]) => await middlewares_arr[0](originalFunc, ctx, ...args)

                for (const middleware of middlewares_arr.slice(1)) {
                    const callee = finalCallee
                    finalCallee = async (ctx: Context, ...args: any[]) => await middleware(callee, ctx, ...args)
                }

                await finalCallee(ctx, ...args)
            }
        }
    }

    static async routeRequest(ctx: Context) {
        try {
            let routeFound = false

            next_route:
            for (let [route_def, cls] of Object.entries(Router.endpoints)) {
                const routeSplit = route_def.split('/')
                const reqRouteSplit = ctx.request.url.split('/')

                if (routeSplit.length != reqRouteSplit.length) continue

                let routeParams = []

                for (let i = 0; i < routeSplit.length; ++i) {
                    if (routeSplit[i].indexOf(':') === 0) {
                        // extracting route-params
                        routeParams.push(reqRouteSplit[i])
                        continue
                    }

                    if (routeSplit[i] !== reqRouteSplit[i]) continue next_route
                    // ^ path doesn't match so we skip try another route
                }

                // At this point, the route matches, and we obtained the route-params

                let handler = cls[ctx.request.method.toLowerCase()] || cls['default']
                // ^ try specified method handler or resort to the default handler
                
                handler
                    ? await handler(ctx, ...routeParams)            // handler found
                    : Router.errorHandler.error501        
                    ? await Router.errorHandler.error501(ctx)       // no handler found try 501 error handler
                    : await Router.errorHandler.default(501, ctx)   // no 501 handler, try default error handler
                
                routeFound = true
                break
            }
            
            if (!routeFound) {
                // If no route matched:

                Router.errorHandler.error404
                    ? await Router.errorHandler.error404(ctx)       // try 404 error handler
                    : await Router.errorHandler.default(404, ctx)   // no 404 handler, try default error handler
            }

        } catch (exception) {
            // Exception throwed

            Router.errorHandler.error505
                ? await Router.errorHandler.error505(ctx, exception)        // try 505 error handler
                : await Router.errorHandler.default(500, ctx, exception)    // no 505 handler, resort to default error handler
        }

        // return JSON response
        if (typeof ctx.response.body === 'object')
            ctx.response.body = JSON.stringify(ctx.response.body)

        ctx.request.respond(ctx.response)
    }
}
