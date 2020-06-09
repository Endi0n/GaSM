import Authentication from '/scripts/auth.js'

let inited = false
let prevState = null

export default async function authGuard() {
    const authenticated = await Authentication.valid

    if (prevState === authenticated) return
    prevState = authenticated

    $('[y-no-auth-required]').toggleClass('hidden', authenticated)
    $('[y-auth-required]').toggleClass('hidden', !authenticated)

    if (!inited) {
        inited = true
        Authentication.addObserver(authGuard)
    }
}
