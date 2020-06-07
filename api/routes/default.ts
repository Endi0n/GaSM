import Router from '../dino/router.ts'
import DefaultErrorHandler from '../dino/default_error_handler.ts'
import Context from '../dino/context.ts'


function test(callforward: (ctx: Context, ...args: any[]) => void, ctx: Context, ...args: any[]) {
    console.log('Hello', args)
    callforward(ctx, 1, ...args)
}


@Router.route('/')
export class Index {

    @Router.middlewares([test, test])
    static get(ctx: Context, x: number, y: number) {
        ctx.response.body = { message: 'Hello world!', nums: [x, y] }
    }

    static default(ctx: Context) {
        ctx.response.body = { error: "I don't know how to handle your request. Try a different request method :'(" }
    }

}


@Router.route('/hello')
export class Hello {

    static get(ctx: Context) {
        ctx.response.body = { message: 'Hello there!' }
    }

    static post(ctx: Context) {
        ctx.response.body = { message : 'Hey postboy!'}
    }

}


@Router.route('/hello/:id')
export class HelloID {

    static get(ctx: Context, id: any) {
        ctx.response.body = { message: `Hello: ${id}!`, type: typeof id}
    }

}


@Router.route('/hello/:id/special')
export class HelloIDSpecial {

    static get(ctx: Context, id: any) {
        ctx.response.body = { message: `Hello special: ${id}!`, type: typeof id}
    }

}


@Router.errorsHandler
export class ErrorHandler extends DefaultErrorHandler {

   static error404(ctx: Context) {
        ctx.response.status = 404
        ctx.response.body = { error : 'Custom not found!' }
    }

}
