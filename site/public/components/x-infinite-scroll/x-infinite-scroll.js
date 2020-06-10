import Component from '/scripts/bee/Component.js'
import BComponent from '/scripts/bee/components/BComponent.js'

class XInfiniteScroll extends Component {
    constructor() {
        super()

        this.component = this.attributes.component.value
    }

    async loadFrom(endpoint) {
        this.endpoint = endpoint

        const data = (await axios.get(endpoint)).data
        console.log(data)
        for (const el of data)
            this.appendChild(new BComponent(this.component, el))
    }
}

Component.define('x-infinite-scroll', XInfiniteScroll)
