export const checkoutAppMajor = process.env.VTEX_APP_VERSION.split('.')[0]
export const checkoutAppLocator = `vtex.checkout@${checkoutAppMajor}.x`
