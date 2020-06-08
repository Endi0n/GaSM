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
            this.#garbageTypes = []

            const query = await client.query("select type from public_dumpster d join garbage_type g \
                                               on d.garbage_type_id = g.id where d.id = ?", [this.#id])
            client.close()
            if (!query[0]) return null

            for (const row of query)
                this.#garbageTypes.push(row.type)
                
            return this.#garbageTypes
        })()
    }

    static async findById(id: number) {
        let client = new DatabaseConnection()
        const query = (await client.query("select * from dumpster_address where id = ? limit 1", [id]))[0]
        client.close()
        if (!query) return null

        let dumpAddr = new Dumpster(query.address, query.lon, query.lat, query.active,
                            new Date(query.date_created), query.date_updated ? new Date(query.date_updated) : null)
        dumpAddr.#id = query.id

        return dumpAddr
    }

    static async getAllActiveDumpsters() {
        let client = new DatabaseConnection()
        const query = await client.query("select * from dumpster_address where active = 1")
        client.close()
        if (!query[0]) return null
        let dumpsterArr = []
        for(const row of query){
            let dumpAddr = new Dumpster(row.address, row.lon, row.lat, row.active,
                                        new Date(row.date_created), query.date_updated ? new Date(query.date_updated) : null)
            dumpAddr.#id = row.id
            dumpsterArr.push(dumpAddr)
        }

        return dumpsterArr
    }

    async save() {
        let client = new DatabaseConnection()
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
        client.close()
    }
}
