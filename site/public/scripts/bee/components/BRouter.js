import Component from '/scripts/bee/Component.js'
import BComponent from '/scripts/bee/components/BComponent.js'
import ComponentsManager from '/scripts/bee/ComponentsManager.js'

export default class BRouter extends Component {
    static _routers = [] 
    
    _routes = {}

    async componentDidLoad() {
        BRouter._routers.push(this)

        Array.from(this.childNodes)
            .filter(el => el.tagName === 'B-ROUTE')
            .forEach(el => {
                if (el.attributes.fallback) {
                    this._fallback = el.attributes.component.value
                    return
                }
                
                this._routes[el.attributes.path.value] = el.attributes.component.value
            })
        
        await this.update(window.location.pathname)
    }

    async _replaceComponent(componentType) {
        if (this.firstChild._componentRemoved)
            await this.firstChild._componentRemoved()
        
        ComponentsManager.removeDependencies(this.firstChild)

        this.replaceChild(new BComponent(componentType), this.firstChild)
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
        BRouter._routers.forEach(async router => await router.update(url))
    }
}

window.addEventListener('popstate', async (e) => {
    await BRouter.route(window.location.pathname)
})

window.customElements.define('b-router', BRouter)
