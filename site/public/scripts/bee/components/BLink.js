import Component from '/scripts/bee/Component.js'
import BRouter from '/scripts/bee/components/BRouter.js'

export default class BLink extends Component {
    constructor() {
        super()
        this.onclick = (e) => BRouter.push(this.attributes.href.value)
    }
}

window.customElements.define('b-link', BLink)
