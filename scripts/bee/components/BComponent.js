import BBaseComponent from '/scripts/bee/BBaseComponent.js'

export default class BComponent extends BBaseComponent {
    constructor(url) {
        super()
        if (url) this.setAttribute('url', url)
    }

    async connectedCallback() {
        await this.loadShadowFrom(this.getAttribute('url'))
    }
}

window.customElements.define('b-component', BComponent)
