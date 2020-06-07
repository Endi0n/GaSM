export * from './login.ts'

import Context from '../../dino/context.ts'

export function authRequired(callforward: (ctx: Context, ...args: any[]) => void, ctx: Context, ...args: any[]) {
    // TODO:
    callforward(ctx, ...args)
}
