import BRoute from '/scripts/bee/components/BRoute.js'
import Authentication from '/scripts/auth.js'
import BHistory from '/scripts/bee/BHistory.js'


class XAuthRequiredRoute extends BRoute {
    async getComponent() {
        if (await Authentication.valid)
            return super.getComponent()

        BHistory.replaceState('/auth/login', {
            refferal: window.location.pathname
        })
    }
}

window.customElements.define('x-auth-required-route', XAuthRequiredRoute)
