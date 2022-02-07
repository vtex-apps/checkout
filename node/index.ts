import { Service } from '@vtex/api'

import { Clients } from './clients'

export default new Service({
  clients: {
    implementation: Clients,
    options: {},
  },
  routes: {},
})
