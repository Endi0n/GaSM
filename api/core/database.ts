import { Client } from "https://deno.land/x/mysql/mod.ts"
import * as db from "./database_config.ts"

export default class DatabaseConnection extends Client{
    constructor() {
        super()
        this.connect({
            hostname: db.HOSTNAME,
            username: db.USERNAME,
            password: db.PASSWORD,
            db: db.DB
        })
    }
}

