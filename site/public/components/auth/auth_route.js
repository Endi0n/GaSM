import BRoute from '/scripts/bee/components/BRoute.js'
import Authentication from '/scripts/auth.js'
import BState from '/scripts/bee/BState.js'


class XAuthRequiredRoute extends BRoute {
    async getComponent() {
        if (await Authentication.valid)
            return super.getComponent()

        BState.replaceState('/auth/login', {
            refferal: window.location.pathname
        })
    }
}

window.customElements.define('x-auth-required-route', XAuthRequiredRoute)
