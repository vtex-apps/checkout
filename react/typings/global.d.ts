import * as R from 'ramda'

declare global {

  interface UTM {
    campaign: string?,
    source: string?,
    medium: string?
  }

  interface SimplifiedHTML {
    language: string,
    head: HTMLElementSimplified[],
    body: string,
    bodyScripts: HTMLElementSimplified[]
  }

  interface HTMLElementSimplified {
    type: string,
    innerHTML: string,
    attributes: Pair[]
  }

  interface Pair {
    key: string,
    value: any
  }

  interface Window extends Window {
    $: any
  }
}
