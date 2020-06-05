import Component from '/scripts/bee/Component.js'
import BComponent from '/scripts/bee/components/BComponent.js'

export default class BRouter extends Component {
    static _routers = [] 
    
    _routes = {}

    async componentDidLoad() {
        BRouter._routers.push(this)

        Array.from(this.childNodes)
            .filter(el => el.tagName === 'B-ROUTE')
            .forEach(el => this._routes[el.attributes.path.value] = el.attributes.component.value)
        
        this.update()
    }

    update() {
        for (const [route, componentType] of Object.entries(this._routes)) {
            if (!new RegExp(route).test(window.location.pathname))
                continue

            this.replaceChild(new BComponent(componentType), this.firstChild)
            break
        }
    }

    static route(url) {
        BRouter._routers.forEach(router => router.update())
    }
}

window.addEventListener('popstate', (e) => {
    BRouter.route(window.location.pathname)
})

window.customElements.define('b-router', BRouter)
