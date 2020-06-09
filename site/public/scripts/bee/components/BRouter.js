import Component from '/scripts/bee/Component.js'
import BRoute from '/scripts/bee/components/BRoute.js'
import BComponent from '/scripts/bee/components/BComponent.js'
import ComponentsManager from '/scripts/bee/ComponentsManager.js'

export default class BRouter extends Component {
    static _observers = [] 
    
    _routes = {}

    static addObserver(observer) {
        BRouter._observers.push(observer)
    }

    async componentDidLoad() {
        BRouter.addObserver(this)

        Array.from(this.childNodes)
            .filter(el => el instanceof BRoute)
            .forEach(el => {
                if (el.attributes.fallback) {
                    this._fallback = el.getComponent.bind(el)
                    return
                }
                
                this._routes[el.attributes.path.value] = el.getComponent.bind(el)
            })
        
        await this.update(window.location.pathname)
    }

    async _replaceComponent(componentType) {
        if (this.firstChild._componentRemoved)
            await this.firstChild._componentRemoved()
        
        ComponentsManager.removeDependencies(this.firstChild)

        this.replaceChild(new BComponent(await componentType()), this.firstChild)
    }

    async update(url) {
        let routeFound = false

        for (const [route, componentType] of Object.entries(this._routes)) {
            if (!new RegExp(`^${route}$`).test(url))
                continue
            
            await this._replaceComponent(componentType)
            
            routeFound = true
            break
        }

        if (!routeFound && this._fallback)
            await this._replaceComponent(this._fallback)
    }

    static async route(url) {
        BRouter._observers.forEach(async observer => await observer.update(url))
    }

    static async push(url) {
        history.pushState(
            null,
            null,
            url
        )
        await BRouter.route(url)
    }
}

window.addEventListener('popstate', async (e) => {
    await BRouter.route(window.location.pathname)
})

window.customElements.define('b-router', BRouter)
