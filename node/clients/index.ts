import { IOClients } from '@vtex/api'

import { FastCheckoutClient } from './fastcheckout'

export class Clients extends IOClients {
  public get fastCheckout() {
    return this.getOrSet('fastCheckout', FastCheckoutClient)
  }
}
