import BBaseComponent from '/scripts/bee/BBaseComponent.js'

class XCard extends BBaseComponent {

    async componentDidMount() {
        const shadow = await this.loadShadowFrom('/components/card.html')

        shadow.getElementById('test')
            .addEventListener('click', () => alert('Hello'))
    }

}

window.customElements.define('x-card', XCard)
