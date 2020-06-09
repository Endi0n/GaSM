import DatabaseConnection from '../core/database.ts'

export default class Dumpster {
    #id: number | null
    #garbageTypes: Array<string> | null
    address: string
    lon: number
    lat: number
    active: boolean
    dateCreated: Date
    dateUpdated: Date | null

    constructor(address: string, lon: number, lat: number, active: boolean, dateCreated: Date, dateUpdated: Date|null = null) {
        this.#id = null
        this.#garbageTypes = null
        this.address = address
        this.lon = lon
        this.lat = lat
        this.active = active
        this.dateCreated = dateCreated
        this.dateUpdated = dateUpdated || null
    }

    get id() {
        return this.#id;
    }

    get garbageTypes() {
        if(this.#garbageTypes !== null)
            return this.#garbageTypes
        return (async () => {
            let client = new DatabaseConnection()
            await client.connect()

            this.#garbageTypes = []

            const query = await client.query("select type from public_dumpster d join garbage_type g \
                                               on d.garbage_type_id = g.id where d.dumpster_address_id = ?", [this.#id])
            await client.close()
            if (!query[0]) return null

            for (const row of query)
                this.#garbageTypes.push(row.type)
                
            return this.#garbageTypes
        })()
    }

    static async findById(id: number) {
        let client = new DatabaseConnection()
        await client.connect()
        const query = (await client.query("select * from dumpster_address where id = ? limit 1", [id]))[0]
        await client.close()
        if (!query) return null

        let dumpAddr = new Dumpster(query.address, query.lon, query.lat, query.active,
                            new Date(query.date_created), query.date_updated ? new Date(query.date_updated) : null)
        dumpAddr.#id = query.id

        return dumpAddr
    }

    static async getAllActiveDumpsters() {
        let dumpsterArr = []
        let lastId = 1
        let client = new DatabaseConnection()
        await client.connect()
        while(true){
            const query = await client.query("select * from dumpster_address where active = 1 and id >= ? limit 10", [lastId])

            if (!query[0]) {
                await client.close()

                if(dumpsterArr.length !== 0)
                    return dumpsterArr
                return null
            }

            for(const row of query) {
                let dumpAddr = new Dumpster(row.address, row.lon, row.lat, row.active,
                                            new Date(row.date_created), query.date_updated ? new Date(query.date_updated) : null)
                dumpAddr.#id = row.id
                dumpsterArr.push(dumpAddr)
                lastId = row.id
            }
            lastId += 1
        }
    }

    static async getGarbageDataWithinRange(dateStart: Date, dateEnd: Date) {
        let client = new DatabaseConnection()
        await client.connect()
        const query = await client.query("SELECT type, SUM(quantity) quantity FROM\
                                          collected c JOIN garbage_type g ON c.garbage_type_id = g.id\
                                          WHERE date BETWEEN ? AND ? GROUP BY TYPE",
                                         [dateStart, dateEnd])
        await client.close()
        if (!query[0]) return null

        let res : Record<string, number> = {}
        query.map((row : Record<string, string>) => res[row.type] = Number(row.quantity))
        return res
    }

    static async getSpecificGarbageDataWithinRange(dateStart: Date, dateEnd: Date, id: any) {
        let client = new DatabaseConnection()
        await client.connect()
        const query = await client.query("SELECT type, SUM(quantity) quantity FROM\
                                          collected c JOIN garbage_type g ON c.garbage_type_id = g.id\
                                          WHERE date BETWEEN ? AND ? and c.dumpster_address_id = ? GROUP BY TYPE",
                                         [dateStart, dateEnd, id])
        await client.close()
        if (!query[0]) return null

        let res : Record<string, number> = {}
        query.map((row : Record<string, string>) => res[row.type] = Number(row.quantity))
        return res
    }

    static async getTableData(dateStart: Date, dateEnd: Date, last_id: any) {
        let res : Record<number, Record<string, any>>= {}
        ++last_id
        let client = new DatabaseConnection()
        await client.connect()
        for(let i=0; i<20 && Object.keys(res).length < 40; ++i) {
            const query = await client.query('SELECT dumpster_address_id, address, type, sum(c.quantity) quantity \
                                            FROM collected c \
                                            JOIN garbage_type g ON g.id = c.garbage_type_id \
                                            JOIN dumpster_address da ON c.dumpster_address_id = da.id \
                                            WHERE date BETWEEN ? AND ? AND da.id >= ? \
                                            group by dumpster_address_id, garbage_type_id limit 10',
                                            [dateStart, dateEnd, last_id||0])
            if(!query[0]) {
                if(Object.keys(res).length !== 0)
                    break
                return null
            }

            for(const row of query) {
                if(!(row['dumpster_address_id'] in res))
                    res[row.dumpster_address_id] = {}
                
                res[row.dumpster_address_id]['address'] = row.address
                res[row.dumpster_address_id][row.type] = Number(row.quantity)
                last_id = row.dumpster_address_id
            }
            ++last_id
        }
        await client.close()

        let final_res = []
        for(let [key, val] of Object.entries(res)) {
            val.id = Number(key)
            final_res.push(val)
            if(Object.keys(final_res).length === 40)
                break
        }
        return final_res
    }

    async save() {
        let client = new DatabaseConnection()
        await client.connect()
        if(this.#id !== null) 
            await client.execute("update dumpster_address set address = ?, lon = ?, lat = ?, active = ?,\
                                  date_created = ?, date_updated = ? where id = ?", 
                                  [this.address, this.lon, this.lat, this.active,
                                  this.dateCreated, this.dateUpdated, this.#id])
        else
            this.#id = (await client.execute("insert into dumpster_address(address, lon, lat, active,\
                                             date_created, date_updated) values(?,?,?,?,?,?)",
                                             [this.address, this.lon, this.lat, this.active,
                                             this.dateCreated, this.dateUpdated]))
                                             .lastInsertId || null
        await client.close()
    }
}
