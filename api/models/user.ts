import {client} from '../core/database.ts'

export default class User {
    private _id: number | null 
    email: string
    password: string
    first_name: string
    last_name: string
    phone_number: string
    address: string
    user_type_id: number
  
    constructor(email: string, password: string, first_name: string, last_name: string,
                phone_number: string, address: string, user_type_id: number) { 
        this._id = null
        this.email = email
        this.password = password
        this.first_name = first_name
        this.last_name = last_name
        this.phone_number = phone_number
        this.address = address
        this.user_type_id = user_type_id
    }

    get id() {
        return this._id;
    }
  
    static async findByEmail(email: string) {
        const query = (await client.query("select * from user where email = ? limit 1", [email]))[0]
        if (!query) return null

        let user = new User(query.email, query.password, query.first_name, query.last_name,
                            query.phone_number, query.address, query.user_type_id)
        user._id = query.id

        return user
    }
  
    static async findById(id: number) {
        const query = (await client.query("select * from user where id = ? limit 1", [id]))[0]
        if (!query) return null

        let user = new User(query.email, query.password, query.first_name, query.last_name,
                            query.phone_number, query.address, query.user_type_id)
        user._id = query.id

        return user
    }

    async save() {
        if(this._id !== null) 
            await client.execute("update user set email = ?, password = ?, first_name = ?, last_name = ?,\
                                  phone_number = ?, address = ?, user_type_id = ? where id = ?", 
                                  [this.email, this.password, this.first_name, this.last_name,
                                  this.phone_number, this.address, this.user_type_id, this._id])
        else
            this._id = (await client.execute("insert into user(email, password, first_name, last_name,\
                                             phone_number, address, user_type_id) values(?,?,?,?,?,?,?)",
                                             [this.email, this.password, this.first_name, this.last_name,
                                             this.phone_number, this.address, this.user_type_id]))
                                             .lastInsertId || null
    }
}
