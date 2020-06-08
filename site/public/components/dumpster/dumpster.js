import Component from '/scripts/bee/Component.js'
import { DUMPSTER_ROUTE } from '/scripts/routes.js'

class XDumpster extends Component {
    constructor() {
        super()
        this.id = this.attributes.id.value
        this.data = axios.get(DUMPSTER_ROUTE(this.id))
    }

    getField(name) {
        return this.getElementsByClassName(name)[0]
    }

	async componentDidLoad() {
        const data = (await this.data).data

        this.getField('id').innerHTML = data.id
        this.getField('address').innerHTML = data.address
        
        this.getField('garbageTypes').innerHTML = data.garbageTypes
            .map(x => x.charAt(0).toUpperCase() + x.slice(1))
            .join(', ')
    }
}

Component.define('x-dumpster', XDumpster, {
    template: '/components/dumpster/dumpster.html'
})
