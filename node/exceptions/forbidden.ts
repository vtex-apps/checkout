export class Forbidden extends Error {
  public status = 403

  constructor (message = 'Forbidden, please try using the token provided by query token as Authorization header') {
    super(message)
  }
}
