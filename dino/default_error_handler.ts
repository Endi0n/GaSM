import Request from './request.ts'


export default class DefaultErrorHandler {
    static default(error_code: number, req: Request, ...args: any) {
        switch (error_code) {
            case 404:
                return { error: '404: Not found!' }
            case 501:
                return { error: '501: Not implemented!' }
            case 505:
                return { error: '500: Internal server error!', exception: args[0] }
        }
    }
}
