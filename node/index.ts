import { Service } from '@vtex/api'

import { Clients } from './clients'
import { renderPage } from './middlewares/renderPage'

const middlewares = [renderPage]

export default new Service({
  clients: {
    implementation: Clients,
    options: {},
  },
  routes: {
    checkoutNext: middlewares,
    checkout: middlewares,
    cart: middlewares,
  },
})
