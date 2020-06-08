import Context from './context.ts'


type RequestHandler = (ctx: Context, ...args: any[]) => Promise<void>
export default RequestHandler
