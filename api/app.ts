import Server from './dino/server.ts'
import './api/routes.ts'

let server = new Server(5000)

await server.serve()
