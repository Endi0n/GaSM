import Server from './dino/server.ts'
import { APP_KEY } from './core/app_config.ts'
import './routes/mod.ts'

let server = new Server(5000, APP_KEY)

await server.serve()
