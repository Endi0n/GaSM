import Component from '/scripts/bee/Component.js'
import ComponentsManager from '/scripts/bee/ComponentsManager.js'


export default class BComponent extends Component {
    constructor(type) {
        super()
        if (type) this.setAttribute('type', type)
    }

    async connectedCallback() {
        this.appendChild(new ComponentsManager.components[this.getAttribute('type')]())
    }
}

window.customElements.define('b-component', BComponent)
