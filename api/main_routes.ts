import Request from '../dino/request.ts'

export function index(req: Request) {
    return { message: 'Hello world!' }
}

export function hello(req: Request) {
    return { message: 'Hello there!' }
}

export function _404(req: Request) {
    return { error: 'Not found!' }
}
