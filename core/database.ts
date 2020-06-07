import { Client } from "https://deno.land/x/mysql/mod.ts"
import * as db from "./database_config.ts"

export const client = await new Client().connect({
    hostname: db.HOSTNAME,
    username: db.USERNAME,
    password: db.PASSWORD,
    db: db.DB
})
