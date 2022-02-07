export async function renderPage(ctx: Context) {
  const pathname = ctx.path

  const renderResult = await ctx.clients.fastCheckout.getPage(pathname)

  ctx.body = renderResult
  ctx.status = 200
}
