import { IOResponse } from '@vtex/api'

export async function renderPage(ctx: Context) {
  const pathname = ctx.path

  let renderResponse: IOResponse<string>

  try {
    renderResponse = await ctx.clients.fastCheckout.getPage(pathname)
  } catch (e) {
    if (!e.isAxiosError) {
      throw e
    }

    renderResponse = e.response
  }

  ctx.body = renderResponse.data
  ctx.status = renderResponse.status

  Object.entries(renderResponse.headers).forEach(
    ([headerName, headerValue]) => {
      ctx.set(headerName, headerValue)
    }
  )
}
