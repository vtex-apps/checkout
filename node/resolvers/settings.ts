import {ForbiddenError} from 'apollo-server-errors'
import {checkoutAppLocator} from '../resources/conf'
import { removeVersion } from '../resources/locator'

const callersBlacklist = ['vtex.graphql-server']

export const settings = async (_, __, ctx: ColossusContext): Promise<Settings | void> => {
  const caller = ctx.get('x-vtex-caller')
  const callerNoVersion = removeVersion(caller)

  if (!callersBlacklist.includes(callerNoVersion)) {
    return ctx.apps.getAppSettings(checkoutAppLocator)
  }

  throw new ForbiddenError(`Caller ${caller} is not allowed`)
}
