import {Apps, InstanceOptions} from '@vtex/api'
import {ColossusContext} from 'colossus'
import * as NodeCache from 'node-cache'
import {compose, keys, map, mergeAll, lensPath,
        over, prop, replace, zipWith} from 'ramda'

const CHECKOUT_BUILD_FILE = 'dist/vtex.checkout/checkout.json'
const RESPONSE_CACHE_TTL = 60 * 60
const CHECKOUT_TIMEOUT = 30 * 1000

const checkoutMajor = process.env.VTEX_APP_VERSION.split('.')[0]
const checkoutAppId = `vtex.checkout@${checkoutMajor}.x`

const cacheStorage = new NodeCache({
  checkperiod: RESPONSE_CACHE_TTL,
  stdTTL: RESPONSE_CACHE_TTL,
  useClones: false,
})

const instanceOptions: InstanceOptions = {
  cacheStorage,
  timeout: CHECKOUT_TIMEOUT
}

const getIdWithoutBuild = (id: string) => id.split('+build')[0]

const notFound = <T>(fallback: T) => (error): T => {
  if (error.response && error.response.status === 404) {
    return fallback
  }
  throw error
}

const getCheckoutFile = (apps: Apps) => (app: string): Promise<CheckoutSettings> => {
  return apps
    .getAppFile(app, CHECKOUT_BUILD_FILE)
    .then(({data}) => data.toString())
    .then(JSON.parse)
    .catch(notFound({}))
}

const replacePatterns = (patterns) => {
  const templates = map(prop("template"), patterns)
  const replacements = map(prop("replacement"), patterns)
  const replaceFnArray = zipWith(replace, templates, replacements)
  return compose(...replaceFnArray)
}

const settings = async (ctx: ColossusContext) => {
  const apps = new Apps(ctx.vtex, instanceOptions)
  const dependencies = await apps.getDependencies(checkoutAppId)
  const dependenciesIds = map(getIdWithoutBuild, keys(dependencies))
  const appsSettings = await Promise.all(map(getCheckoutFile(apps), dependenciesIds))
  const selfSettings = await apps.getAppSettings(checkoutAppId) as CheckoutSettings
  const mergedSettings = mergeAll(appsSettings.concat(selfSettings))

  const patterns = [
    {
      template: "{{account}}",
      replacement: ctx.vtex.account
    },
    {
      template: "{{region}}",
      replacement: process.env.VTEX_REGION
    },
    {
      template: "{{workspace}}",
      replacement: ctx.vtex.workspace
    }
  ]
  const urlLens = lensPath(["taxConfiguration", "url"])

  try {
    ctx.response.body = over(urlLens, replacePatterns(patterns), mergedSettings)
  } catch (e) {
    ctx.response.body = mergedSettings
  }
}

export default {
  routes: {
    settings
  }
}
