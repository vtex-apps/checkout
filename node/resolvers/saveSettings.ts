import { ForbiddenError } from 'apollo-server-errors'
import deepmerge from 'deepmerge'
import { checkoutAppLocator } from '../resources/conf'
import { removeVersion } from '../resources/locator'

const callersBlacklist = ['vtex.graphql-server']

const dontMergeArrays = (_, source) => source

export const saveSettings = async (_, args: {settings: Settings}, ctx: ColossusContext): Promise<Settings | void> => {
  const caller = ctx.get('x-vtex-caller')
  const {settings: newSettings} = args
  const callerNoVersion = removeVersion(caller)

  if (!callersBlacklist.includes(callerNoVersion)) {
    const oldSettings = await ctx.apps.getAppSettings(checkoutAppLocator) as Settings
    const settings: Settings = deepmerge(oldSettings, newSettings, {arrayMerge: dontMergeArrays})
    return ctx.apps.saveAppSettings(checkoutAppLocator, settings)
  }

  throw new ForbiddenError(`Caller ${caller} is not allowed`)
}
