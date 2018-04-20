import {Apps, InstanceOptions} from '@vtex/api'
import {ColossusContext} from 'colossus'
import * as NodeCache from 'node-cache'
import {keys, map, mergeAll} from 'ramda'

const CHECKOUT_BUILD_FILE = 'dist/vtex.checkout/checkout.json'
const RESPONSE_CACHE_TTL = 60 * 60
const CHECKOUT_TIMEOUT = 30 * 1000

const cacheStorage = new NodeCache({
  checkperiod: RESPONSE_CACHE_TTL,
  stdTTL: RESPONSE_CACHE_TTL,
  useClones: false,
})

const getUserAgent = () => {
  return process.env.VTEX_APP_ID
}

export const getApps = (ctx: ColossusContext): Apps => {
  const {account, authToken, region, workspace} = ctx.vtex
  const userAgent: string = getUserAgent()
  const opts: InstanceOptions = {
    account,
    authToken,
    cacheStorage,
    region,
    userAgent,
    workspace,
    timeout: CHECKOUT_TIMEOUT
  }
  return new Apps(opts)
}

const getCheckoutMajor = () => {
  return parseInt(process.env.VTEX_APP_VERSION.split('.')[0], 10)
}

const getCheckoutAppId = () => {
  return `vtex.checkout@${getCheckoutMajor()}.x`
}

const getIdWithoutBuild = (id: string) => id.split('+build')[0]

const toString = ({data}) => data.toString()

const notFound = <T>(fallback: T) => (error): T => {
  if (error.response && error.response.status === 404) {
    return fallback
  }
  throw error
}

const getCheckoutFile = (apps: Apps) => async (app: string) => {
  return apps
    .getAppFile(app, CHECKOUT_BUILD_FILE)
    .then(toString)
    .then(JSON.parse)
    .catch(notFound(null))
      }

const setCheckout = async (ctx: ColossusContext) => {
  const apps: Apps = getApps(ctx)
  const filter: String = getCheckoutAppId()

  const dependencies: String[] = map(getIdWithoutBuild,
                                     keys(await apps.getDependencies(filter)))

  const files = await Promise.all(map(getCheckoutFile(apps),
                                      dependencies))

  const appSettings = await apps.getAppSettings(filter)

  const mergedSettings = mergeAll(files.concat(appSettings))

  ctx.set('Cache-Control', 'no-cache')
  ctx.response.status = 200
  ctx.response.body = mergedSettings

  ctx.set('X-VTEX-Meta-Bucket', [
    'apps.meta.settings',
    'apps.meta.dependencies',
    'apps.meta.installations',
    'apps.meta.links'
  ])
}

export default {
  routes: {
    setupCheckout: setCheckout
  }
}
