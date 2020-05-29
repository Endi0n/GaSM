import Request from '../dino/request.ts'
import * as endpoint from './main_routes.ts'

let routes:Record<string, (req: Request) => void> = {
    '/': endpoint.index,
    '/hello': endpoint.hello,

    404: endpoint._404
}

export default routes
