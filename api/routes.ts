import Request from '../dino/request.ts'
import Router from '../dino/router.ts'
import DefaultErrorHandler from '../dino/default_error_handler.ts'

function test(callforward: (req: Request, ...args: any[]) => any, req: Request, ...args: any[]) {
    console.log('Hello', args)
    return callforward(req, 1, ...args)
}

@Router.route('/')
export class Index {

    @Router.middlewares([test, test])
    static get(req: Request, x: number, y: number) {
        return { message: 'Hello world!', nums: [x, y] }
    }

    static default(req: Request) {
        return { error: "I don't know how to handle your request. Try a different request method :'(" }
    }

}


@Router.route('/hello')
export class Hello {

    static get(req: Request) {
        return { message: 'Hello there!' }
    }

    static post(req: Request) {
        return { message : 'Hey postboy!'}
    }

}

@Router.route('/hello/:id')
export class HelloID {

    static get(req: Request, id: any) {
        return { message: `Hello: ${id}!`, type: typeof id}
    }

}

@Router.route('/hello/:id/special')
export class HelloIDSpecial {

    static get(req: Request, id: any) {
        return { message: `Hello special: ${id}!`, type: typeof id}
    }

}

@Router.errorsHandler
export class ErrorHandler extends DefaultErrorHandler {

   static error404(req: Request) {
        return { error : 'Custom not found!' }
    }

}
