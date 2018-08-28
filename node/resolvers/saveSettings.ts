import { ForbiddenError } from 'apollo-server-errors'
import deepmerge from 'deepmerge'
import { checkoutAppId, checkoutAppLocator } from '../resources/conf'

const arrayMerge = (_, source) => source

export const saveSettings = async (_, args: {settings: Settings}, ctx: ColossusContext): Promise<Settings | void> => {
  const caller = ctx.get('x-vtex-caller')
  const {settings: newSettings} = args

  const oldSettings = await ctx.apps.getAppSettings(checkoutAppLocator) as Settings
  const settings: Settings = deepmerge(oldSettings, newSettings, {arrayMerge})
  return ctx.apps.saveAppSettings(checkoutAppLocator, settings)

  // console.log(settings)

  // if (caller === checkoutAppId) {
  // }

  throw new ForbiddenError(`Caller ${caller} is different from appId ${checkoutAppId}`)
}
