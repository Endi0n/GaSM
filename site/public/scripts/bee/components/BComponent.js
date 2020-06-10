import Component from '/scripts/bee/Component.js'
import ComponentsManager from '/scripts/bee/ComponentsManager.js'


export default class BComponent extends Component {
    constructor(type, data) {
        super()
        if (!type) return

        this.setAttribute('type', type)
        this.data = data
    }

    async componentDidMount() {
        this.appendChild(new ComponentsManager.components[this.getAttribute('type')](this.data))
    }
}

window.customElements.define('b-component', BComponent)
