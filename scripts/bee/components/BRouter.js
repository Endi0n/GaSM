import Component from '/scripts/bee/Component.js'
import BComponent from '/scripts/bee/components/BComponent.js'

export default class BRouter extends Component {
    static _routers = [] 

    async componentDidLoad() {
        BRouter._routers.push(this)

        this.routes = {}

        Array.from(this.childNodes)
            .filter(el => el.tagName === 'B-ROUTE')
            .forEach(el => this.routes[el.attributes.path.value] = el.attributes.component.value)
        
        this.update()
    }

    update() {
        this.replaceChild(new BComponent(this.routes[window.location.pathname]), this.firstChild)
    }

    static route(url) {
        BRouter._routers.forEach(router => router.update())
    }
}

window.addEventListener('popstate', (e) => {
    BRouter.route(window.location.pathname)
})

window.customElements.define('b-router', BRouter)
