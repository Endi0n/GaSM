export * from './login.ts'
export * from './register.ts'

import Context from '../../dino/context.ts'

export function authRequired(callforward: (ctx: Context, ...args: any[]) => void, ctx: Context, ...args: any[]) {
    // TODO:
    callforward(ctx, ...args)
}
