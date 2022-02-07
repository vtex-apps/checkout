import { ExternalClient, IOContext } from '@vtex/api'

const BASE_URL = 'http://checkout.vtex.io'

export class FastCheckoutClient extends ExternalClient {
  constructor(context: IOContext) {
    super(BASE_URL, context, {
      timeout: 10_000,
    })
  }

  public getPage(pathname: string): Promise<string> {
    const url = new URL(pathname, BASE_URL)

    url.searchParams.set('an', this.context.account)

    return this.http.get(url.pathname + url.search, {
      headers: { 'X-Vtex-Use-Https': 'true' },
    })
  }
}
