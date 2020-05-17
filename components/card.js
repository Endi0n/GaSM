import BBaseComponent from '/scripts/bee/BBaseComponent.js'

class XCard extends BBaseComponent {

    async componentDidMount() {
        this.getElementsByTagName('h1')[0]
            .addEventListener('click', () => alert('Hello'))
    }

}

window.customElements.define('x-card', XCard)
