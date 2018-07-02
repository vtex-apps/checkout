import {Apps, InstanceOptions} from '@vtex/api'
import {ColossusContext} from 'colossus'
import * as LRU from 'lru-cache'
import {Forbidden} from '../exceptions/forbidden'

const RESPONSE_CACHE_TTL = 60 * 60
const MAX_LRU_CACHE = 1e3
const CHECKOUT_TIMEOUT = 30 * 1000

const checkoutMajor = process.env.VTEX_APP_VERSION.split('.')[0]
const checkoutAppId = `vtex.checkout@${checkoutMajor}.x`

const cacheStorage = new LRU({
  max: MAX_LRU_CACHE,
  maxAge: RESPONSE_CACHE_TTL,
  useClones: false,
})

const instanceOptions: InstanceOptions = {
  cacheStorage,
  timeout: CHECKOUT_TIMEOUT
}

const appId = process.env.VTEX_APP_ID

const getAppSettings = async (ctx: ColossusContext) => {
  const {vtex: IOContext} = ctx
  const apps = new Apps(IOContext, instanceOptions)
  return await apps.getAppSettings(checkoutAppId)
}

export const settings = async (obj, args, ctx: ColossusContext, info) => {
  const {request: {headers}} = ctx
  const caller = headers['x-vtex-caller']

  if (caller === appId) {
    const ret = await getAppSettings(ctx)
    ret.apps = ret.apps && JSON.parse(ret.apps)
    return ret
  }

  throw new Forbidden()
}

export const taxConfiguration = async (obj, args, ctx: ColossusContext, info) => {
  const {request: {headers}} = ctx
  const caller = headers['x-vtex-caller']

  if (caller === appId) {
    const ret = await getAppSettings(ctx)
    return ret && ret.taxConfiguration
  }

  throw new Forbidden()
}

export const paymentConfiguration = async (obj, args, ctx: ColossusContext, info) => {
  const {request: {headers}} = ctx
  const caller = headers['x-vtex-caller']

  if (caller === appId) {
    const ret = await getAppSettings(ctx)
    return ret && ret.paymentConfiguration
  }

  throw new Forbidden()
}

export const token = async (obj, args, ctx: ColossusContext, info) => {
  const {vtex: {authToken}} = ctx
  return authToken
}
