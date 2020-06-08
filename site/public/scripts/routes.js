export const BASE_API_ROUTE = 'http://localhost/api'

export const LOGIN_ROUTE = BASE_API_ROUTE + '/auth/login'
export const REGISTER_ROUTE = BASE_API_ROUTE + '/auth/register'

export const DUMPSTERS_ROUTE = BASE_API_ROUTE + '/dumpsters'
export const DUMPSTER_ROUTE = id => BASE_API_ROUTE + `/dumpster/${id}`
