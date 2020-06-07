import Server from './dino/server.ts'
import './routes/mod.ts'

let server = new Server(5000)

await server.serve()
