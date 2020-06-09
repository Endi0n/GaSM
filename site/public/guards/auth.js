import Cache from '/scripts/cache.js'

export default async function authGuard(element) {
    $(element).find('[y-no-auth-required]').toggleClass('hidden', Cache.userAuthenticated)
    $(element).find('[y-auth-required]').toggleClass('hidden', !Cache.userAuthenticated)
}
