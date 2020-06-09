import Component from '/scripts/bee/Component.js'

export default class BRoute extends Component {
    async getComponent() {
        return this.attributes.component.value
    }
}

window.customElements.define('b-route', BRoute)
