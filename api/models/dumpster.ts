import {client} from '../core/database.ts'

export default class Dumpster {
    private _id: number | null
    private _garbage_type: string | null 
    address: string
    lon: number
    lat: number
    active: number
    date_created: Date
    date_updated: Date | null

    constructor(address: string, lon: number, lat: number, active: number, date_created: Date, date_updated: Date|null = null) {
        this._id = null
        this._garbage_type = null
        this.address = address
        this.lon = lon
        this.lat = lat
        this.active = active
        this.date_created = date_created
        this.date_updated = date_updated || null
    }

    get id() {
        return this._id;
    }

    get garbage_type() {
        if(this._garbage_type !== null)
            return this._garbage_type
        return (async () => {
            const query = (await client.query("select type from public_dumpster d join garbage_type g \
                                               on d.garbage_type_id = g.id where d.id = ? limit 1", [this._id]))[0]
            if (!query) return null
            
            this._garbage_type = query.type
            return query.type
        })()
    }

    static async findById(id: number) {
        const query = (await client.query("select * from dumpster_address where id = ? limit 1", [id]))[0]
        if (!query) return null

        let dump_addr = new Dumpster(query.address, query.lon, query.lat, query.active,
                            new Date(query.date_created), new Date(query.date_updated))
        dump_addr._id = query.id

        return dump_addr
    }

    async save() {
        if(this._id !== null) 
            await client.execute("update dumpster_address set address = ?, lon = ?, lat = ?, active = ?,\
                                  date_created = ?, date_updated = ? where id = ?", 
                                  [this.address, this.lon, this.lat, this.active,
                                  this.date_created, this.date_updated, this._id])
        else
            this._id = (await client.execute("insert into dumpster_address(address, lon, lat, active,\
                                             date_created, date_updated) values(?,?,?,?,?,?)",
                                             [this.address, this.lon, this.lat, this.active,
                                             this.date_created, this.date_updated]))
                                             .lastInsertId || null
    }
}
