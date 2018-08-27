import { ForbiddenError } from 'apollo-server-errors'
import { checkoutAppId, checkoutAppLocator } from '../resources/conf'

export const saveSettings = async (_, args: {settings: Settings}, ctx: ColossusContext): Promise<Settings | void> => {
  const caller = ctx.get('x-vtex-caller')
  const {settings} = args

  if (caller === checkoutAppId) {
    return ctx.apps.saveAppSettings(checkoutAppLocator, settings)
  }

  throw new ForbiddenError(`Caller ${caller} is different from appId ${checkoutAppId}`)
}
