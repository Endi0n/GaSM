import Component from '/scripts/bee/Component.js'
import BRouter from '/scripts/bee/components/BRouter.js'

export default class BLink extends Component {
    constructor() {
        super()
        this.onclick = (e) => {
            const newLocation = this.attributes.href.value
            
            history.pushState(
                null,
                null,
                newLocation
            )

            BRouter.route(newLocation)
        }
    }
}

window.customElements.define('b-link', BLink)
