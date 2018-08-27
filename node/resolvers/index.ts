import {Apps, InstanceOptions} from '@vtex/api'
import * as LRU from 'lru-cache'
import {map} from 'ramda'
import {saveSettings} from './saveSettings'
import {settings} from './settings'

const RESPONSE_CACHE_TTL_MS = 60 * 60 * 1e3
const MAX_LRU_CACHE = 1e3
const CHECKOUT_TIMEOUT_MS = 30 * 1000

const cacheStorage = new LRU({
  max: MAX_LRU_CACHE,
  maxAge: RESPONSE_CACHE_TTL_MS,
  useClones: false,
})

const instanceOptions: InstanceOptions = {
  cacheStorage,
  timeout: CHECKOUT_TIMEOUT_MS
}

const prepare = (resolver) => async (root, args, ctx: ColossusContext, info) => {
  const {vtex: IOContext} = ctx
  ctx.apps = new Apps(IOContext, instanceOptions)
  return resolver(root, args, ctx, info)
}

export const resolvers = {
  Mutation: map(prepare, {
    saveSettings
  }),
  Query: map(prepare, {
    settings
  }),
}
