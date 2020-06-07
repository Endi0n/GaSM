import Context from './context.ts'


type RequestHandler = (ctx: Context, ...args: any[]) => void
export default RequestHandler
