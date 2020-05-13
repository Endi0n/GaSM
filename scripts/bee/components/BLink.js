import BBaseComponent from '/scripts/bee/BBaseComponent.js'
import BRouter from '/scripts/bee/components/BRouter.js'

export default class BLink extends BBaseComponent {
    constructor() {
        super()
        this.onclick = (e) => {
            const newLocation = this.attributes.href.value
            
            history.pushState(
                {'page': newLocation},
                `Page {newLocation}`,
                newLocation
            )

            BRouter.route(newLocation)
        }
    }
}

window.customElements.define('b-link', BLink)

