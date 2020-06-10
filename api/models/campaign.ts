import DatabaseConnection from '../core/database.ts'

export default class Campaign {
    #id: number | null 
    #userId: number
    title: string
    content: string
    date: Date
    address: string
  
    constructor(userId: number, title: string, content: string, date: Date,
                address: string) { 
        this.#id = null
        this.#userId = userId
        this.title = title
        this.content = content
        this.date = date
        this.address = address
    }

    get id() {
        return this.#id;
    }

    get userId() {
        return this.#userId;
    }

    static async findPosts(lastId?: string) {
        let client = new DatabaseConnection()
        await client.connect()
        let query: Promise<any> | null = null

        if (!lastId) 
            query = client.query("select * from campaign where id order by id desc limit 5")
        else 
            query = client.query("select * from campaign where id < ? order by id desc limit 5", [lastId])
        
        const result = await query
        
        await client.close()

        return result
    }

    static async findUserPosts(userId: number, lastId?: number) {}
    
}
