export default class BState {
    static _inited = false
    static _observers = [] 
    static _state = null

    static addObserver(observer) {
        BState._observers.push(observer)
    }

    static async pushState(url, state) {
        history.pushState(
            state,
            null,
            url
        )

        BState._state = state

        await BState._update(url)
    }

    static async replaceState(url, state) {
        history.replaceState(
            state,
            null,
            url
        )

        BState._state = state

        await BState._update(url)
    }

    static async update(state) {
        await BState.replaceState(window.location.pathname, state)
    }

    static async _update(url) {
        BState._observers.forEach(async observer => await observer.update(url))
    }

    static get state() {
        return BState._state
    }
}

if (!BState._inited) {
    BState._inited = true
    window.addEventListener('popstate', async (e) => {
        await BState._update(window.location.pathname)
    })
}
