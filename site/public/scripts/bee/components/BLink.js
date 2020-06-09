import Component from '/scripts/bee/Component.js'
import BHistory from '/scripts/bee/BHistory.js'

export default class BLink extends Component {
    constructor() {
        super()
        this.onclick = (e) => BHistory.pushState(this.attributes.href.value)
    }
}

window.customElements.define('b-link', BLink)
