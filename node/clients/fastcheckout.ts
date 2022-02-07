import { ExternalClient, IOContext } from '@vtex/api'

export class FastCheckoutClient extends ExternalClient {
  constructor(context: IOContext) {
    super('http://checkout.vtex.io', context, {
      timeout: 10_000,
    })
  }

  public getPage(pathname: string): Promise<string> {
    return this.http.get(pathname, { headers: { 'X-Vtex-Use-Https': 'true' } })
  }
}
