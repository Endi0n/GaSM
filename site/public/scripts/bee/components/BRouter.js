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
            .forEach(el => this._routes[el.attributes.path.value] = el.attributes.component.value)
        
        await this.update()
    }

    async update() {
        for (const [route, componentType] of Object.entries(this._routes)) {
            if (!new RegExp(`^${route}$`).test(window.location.pathname))
                continue
            
            if (this.firstChild._componentRemoved)
                await this.firstChild._componentRemoved()
            ComponentsManager.removeDependencies(this.firstChild)

            this.replaceChild(new BComponent(componentType), this.firstChild)
            break
        }
    }

    static async route(url) {
        BRouter._routers.forEach(async router => await router.update())
    }
}

window.addEventListener('popstate', async (e) => {
    await BRouter.route(window.location.pathname)
})

window.customElements.define('b-router', BRouter)
