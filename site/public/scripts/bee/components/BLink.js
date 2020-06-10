import Component from '/scripts/bee/Component.js'
import BState from '/scripts/bee/BState.js'

export default class BLink extends Component {
    constructor() {
        super()
        this.onclick = (e) => BState.pushState(this.attributes.href.value)
    }
}

window.customElements.define('b-link', BLink)
