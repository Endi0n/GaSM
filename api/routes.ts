import Request from '../dino/request.ts'
import Router from '../dino/router.ts'

@Router.route('/')
export class index {
    get(req: Request) {
        return { message: 'Hello world!' }
    }
    default(req: Request) {
        return { error: "I don't know how to handle your request. Try a different request method :'(" }
    }
}

@Router.route('/hello')
export class hello {
    get(req: Request) {
        return { message: 'Hello there!' }
    }
    post(req: Request) {
        return { message : 'Hey postboy!'}
    }
}

@Router.route('/404')
export class _404 {
    get(req: Request) {
        return { error : 'Not found!' }
    }
}
