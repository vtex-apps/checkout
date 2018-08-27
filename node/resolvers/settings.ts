import {ForbiddenError} from 'apollo-server-errors'
import {checkoutAppId, checkoutAppLocator} from '../resources/conf'

export const settings = async (_, __, ctx: ColossusContext): Promise<Settings | void> => {
  const caller = ctx.get('x-vtex-caller')

  if (caller === checkoutAppId) {
    return ctx.apps.getAppSettings(checkoutAppLocator)
  }

  throw new ForbiddenError(`Caller ${caller} is different from appId ${checkoutAppId}`)
}
