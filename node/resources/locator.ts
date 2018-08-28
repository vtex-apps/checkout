export const removeVersion = (app: string) => {
  const [appNoVersion] = app && app.split('@')
  return appNoVersion || app
}
