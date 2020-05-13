import BBaseComponent from '/scripts/bee/BBaseComponent.js'
import Page from '/scripts/bee/components/BComponent.js'

export default class BRouter extends BBaseComponent {
    static _routers = [] 

    async componentDidLoad() {
        BRouter._routers.push(this)

        this.routes = {}

        Array.from(this.childNodes)
            .filter(el => el.tagName === 'B-ROUTE')
            .forEach(el => this.routes[el.attributes.path.value] = el.attributes.page.value)
        
        this.update()
    }

    update() {
        this.replaceChild(new Page(this.routes[window.location.pathname]), this.firstChild)
    }

    static route(url) {
        history.pushState(null, null, url)
        BRouter._routers.forEach(router => router.update())
    }
}

window.addEventListener('popstate', (e) => {
    if (history.state)
        BRouter.route(e.originalEvent.page)
})

window.customElements.define('b-router', BRouter)
