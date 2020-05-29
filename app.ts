import routes from './api/routes.ts'
import Server from './dino/server.ts'

let server = new Server(5000, './public', routes)

await server.serve()
