import { Apps, Service, ServiceContext, LRUCache, Cached } from '@vtex/api'
import { keys, map, mergeAll } from 'ramda'

const CHECKOUT_BUILD_FILE = 'dist/vtex.checkout/checkout.json'
const RESPONSE_CACHE_TTL = 60 * 60
const APPS_TIMEOUT = 30 * 1000

const [checkoutMajor] = process.env.VTEX_APP_VERSION!.split('.')
const checkoutAppId = `vtex.checkout@${checkoutMajor}.x`

const appsCache = new LRUCache<string, Cached>({
  checkperiod: RESPONSE_CACHE_TTL,
  stdTTL: RESPONSE_CACHE_TTL,
  useClones: false,
})

const getIdWithoutBuild = (id: string) => id.split('+build')[0]

const notFound = <T>(fallback: T) => (error: any): T => {
  if (error.response && error.response.status === 404) {
    return fallback
  }
  throw error
}

const getCheckoutFile = (apps: Apps) => (
  app: string
): Promise<CheckoutSettings> => {
  return apps
    .getAppFile(app, CHECKOUT_BUILD_FILE)
    .then(({ data }) => data.toString())
    .then(JSON.parse)
    .catch(notFound({}))
}

const settings = async (ctx: ServiceContext) => {
  const {
    clients: { apps },
  } = ctx

  const dependencies = await apps.getDependencies(checkoutAppId)
  const dependenciesIds = map(getIdWithoutBuild, keys(dependencies))
  const appsSettings = await Promise.all(
    map(getCheckoutFile(apps), dependenciesIds)
  )
  const selfSettings = (await apps.getAppSettings(
    checkoutAppId
  )) as CheckoutSettings
  const mergedSettings = mergeAll(appsSettings.concat(selfSettings))

  ctx.response.body = mergedSettings
}

export default new Service({
  clients: {
    options: {
      apps: {
        timeout: APPS_TIMEOUT,
        memoryCache: appsCache,
      },
    },
  },
  routes: {
    settings,
  },
})
