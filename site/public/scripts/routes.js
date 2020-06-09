export const BASE_API_ROUTE = 'http://localhost/api'

export const CHECK_AUTH_ROUTE = BASE_API_ROUTE + '/auth/check'
export const LOGIN_ROUTE = BASE_API_ROUTE + '/auth/login'
export const REGISTER_ROUTE = BASE_API_ROUTE + '/auth/register'

export const DUMPSTERS_ROUTE = BASE_API_ROUTE + '/dumpsters'
export const DUMPSTER_ROUTE = id => BASE_API_ROUTE + `/dumpster/${id}`
export const DUMPSTERS_STATS_ROUTE = (start, end) => BASE_API_ROUTE + `/dumpsters/stats?dateStart=${start}&dateEnd=${end}`
