export default class BHistory {
    static _inited = false
    static _observers = [] 

    static addObserver(observer) {
        BHistory._observers.push(observer)
    }

    static async pushState(url, state) {
        history.pushState(
            state,
            null,
            url
        )

        await BHistory._route(url)
    }

    static async replaceState(url, state) {
        history.replaceState(
            state,
            null,
            url
        )

        await BHistory._route(url)
    }

    static async _route(url) {
        BHistory._observers.forEach(async observer => await observer.update(url))
    }
}

if (!BHistory._inited) {
    BHistory._inited = true
    window.addEventListener('popstate', async (e) => {
        await BHistory._route(window.location.pathname)
    })
}
