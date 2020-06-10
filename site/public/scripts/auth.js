import { CHECK_AUTH_ROUTE } from '/scripts/routes.js'
import BState from '/scripts/bee/BState.js'

export default class Authentication {
    static _inited = false
    static _valid = false
    static _token = null
    
    static _observers = []

    static async _init() {
        Authentication._token = localStorage.token

        if (Authentication._token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${Authentication._token}`

        await Authentication.reCheck(false)
    }

    static addObserver(observer) {
        Authentication._observers.push(observer)
    }

    static async reCheck(broadcast) {
        Authentication._valid = (await axios.get(CHECK_AUTH_ROUTE)).data.status[0] === 'a'

        if (!broadcast) return
        Authentication._observers.forEach(async el => await el())
    }

    static get valid() {
        return (async () => {
            if (!Authentication._inited)
                await Authentication._init()
            return Authentication._valid
        })()
    }

    static set token(token) {
        localStorage.setItem('token', token)
        Authentication._token = token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        Authentication._observers.forEach(async el => await el())
    }

    static logout() {
        localStorage.removeItem('token')
        Authentication._token = null
        Authentication._valid = false
        delete axios.defaults.headers.common['Authorization']
        Authentication._observers.forEach(async el => await el())
        BState.update()
    }
}
