import BHistory from '/scripts/bee/BHistory.js'
import { CHECK_AUTH_ROUTE } from '/scripts/routes.js'

export default class Cache {
    static _inited = false
    static dumpsters = null
    static _userAuthenticated = false

    static async _init() {
        if (Cache._inited) return

        Cache._inited = true
        BHistory.addObserver(Cache)
    }

    static async update(url) {
        Cache._userAuthenticated = (await axios.get(CHECK_AUTH_ROUTE)).data.status[0] === 'a'
        console.log(Cache._userAuthenticated)
    }

    static get userAuthenticated() {
        return Cache._userAuthenticated
    }
}

Cache._init()
