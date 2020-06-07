import Context from './context.ts'
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

    static middlewares(middlewares: Array<(callforward: (ctx: Context, ...args: any[]) => void, ctx: Context, ...args: any) => void>) {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            const originalFunc: (ctx: Context, ...args: any[]) => void = descriptor.value

            descriptor.value = (ctx: Context, ...args: any[]) => {
                middlewares.reverse()
                
                let finalCallee: (ctx: Context, ...args: any[]) => void = (ctx: Context, ...args: any[]) => middlewares[0](originalFunc, ctx, ...args)

                for (const middleware of middlewares.slice(1)) {
                    const callee = finalCallee
                    finalCallee = (ctx: Context, ...args: any[]) => middleware(callee, ctx, ...args)
                }

                finalCallee(ctx, ...args)
            }
        }
    }

    static async routeRequest(ctx: Context) {
        try {
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
                
                break  // route found
            }
            
            if (!ctx.response.body) {
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
