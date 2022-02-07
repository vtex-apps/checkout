import { IOResponse } from '@vtex/api'
import { parse } from 'cookie'

const parseCookie = (cookie: string, domain?: string) => {
  const parsed = parse(cookie)
  const cookieName = Object.keys(parsed)[0] as string
  const cookieValue = parsed[cookieName]

  const extraOptions = {
    path: parsed.path,
    domain: domain ?? parsed.domain,
    expires: parsed.expires ? new Date(parsed.expires) : undefined,
  }

  return {
    name: cookieName,
    value: cookieValue,
    options: extraOptions,
  }
}

const CHECKOUT_COOKIE = 'checkout.vtex.com'

const SetCookieWhitelist = [CHECKOUT_COOKIE, '.ASPXAUTH']

const isWhitelistedSetCookie = (cookie: string) => {
  const [key] = cookie.split('=')
  return SetCookieWhitelist.includes(key)
}

function forwardCheckoutCookies(rawHeaders: Record<string, any>, ctx: Context) {
  const responseSetCookies: string[] = rawHeaders?.['set-cookie'] || []

  const host = ctx.get('x-forwarded-host')
  const forwardedSetCookies = responseSetCookies.filter(isWhitelistedSetCookie)

  const parseAndClean = (cookie: string) => parseCookie(cookie, host)

  const cleanCookies = forwardedSetCookies.map(parseAndClean)

  cleanCookies.forEach(({ name, value, options }) =>
    ctx.cookies.set(name, value, options)
  )
}

export async function renderPage(ctx: Context) {
  const pathname = ctx.path

  let renderResponse: IOResponse<string>

  try {
    const checkoutCookieValue = ctx.cookies.get(CHECKOUT_COOKIE)

    let checkoutCookie

    if (checkoutCookieValue != null) {
      checkoutCookie = `${CHECKOUT_COOKIE}=${checkoutCookieValue}`
    }

    renderResponse = await ctx.clients.fastCheckout.getPage(
      pathname,
      checkoutCookie
    )
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
      if (headerName.toLowerCase() === 'set-cookie') {
        return
      }

      ctx.set(headerName, headerValue)
    }
  )

  forwardCheckoutCookies(renderResponse.headers, ctx)
}
