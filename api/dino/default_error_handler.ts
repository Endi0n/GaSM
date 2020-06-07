import Context from './context.ts'


export default class DefaultErrorHandler {
    static async default(error_code: number, ctx: Context, ...args: any) {
        ctx.response.status = error_code

        ctx.response.body = (() => {
            switch (error_code) {
                case 404:
                    return { error: '404: Not found!' }
                case 501:
                    return { error: '501: Not implemented!' }
                case 505:
                    return { error: '500: Internal server error!', exception: args[0] }
            }
        })()
    }
}
