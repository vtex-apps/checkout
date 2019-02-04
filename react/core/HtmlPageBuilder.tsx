import * as R from 'ramda'
import React, { Fragment } from 'react'
import { Helmet } from 'vtex.render-runtime'

import { extensionLoaderScript } from './scripts'

interface ScriptToReplace {
  shouldReplace: (el: HTMLElementSimplified) => boolean,
  replacer: (el: HTMLElementSimplified) => HTMLElementSimplified
}

const pairsToObject = (arr : Pair[]) => {
  return R.reduce((acc: any, prop: Pair) => {
    return {
      ... acc,
      [prop.key]: prop.value,
    }
  }, {}, arr) as any
}

const createAttributesObject = (el: HTMLElementSimplified) => pairsToObject(el.attributes)

const createHtmlElement = (el: HTMLElementSimplified , index: number) => {
  return React.createElement(el.type, {
    key: index,
    ... createAttributesObject(el),
    ... el.innerHTML.length > 0 ? { dangerouslySetInnerHTML: { __html: el.innerHTML } } : {},
  })
}

const forceToWaitDOMContentLoaded = (el: HTMLElementSimplified): HTMLElementSimplified => {
  const innerHTML = `\ndocument.addEventListener("DOMContentLoaded", function() {\n\
    ${el.innerHTML}
  });\n`
  return {
    ...el,
    innerHTML,
  }
}

const withDefer = (el: HTMLElementSimplified): HTMLElementSimplified => {
  return (el.innerHTML.length > 0) ? el : { ...el, attributes: R.append({key: 'defer', value: true}, el.attributes)}
}

class HtmlPageBuilder {

  private language: string
  private body: string
  private bodyScripts: HTMLElementSimplified[]
  private head: HTMLElementSimplified[]

  constructor(simplifiedHTML: SimplifiedHTML) {
    this.body = simplifiedHTML.body
    this.bodyScripts = simplifiedHTML.bodyScripts
    this.head = simplifiedHTML.head
    this.language = simplifiedHTML.language
  }

  public getBody() {
    return (
      <Fragment>
        <div dangerouslySetInnerHTML={ { __html: this.body } } />
        { this.getBodyScripts() }
      </Fragment>
    )
  }

  public getHelmetHead() {
    const headElements = this.head.map((el: HTMLElementSimplified, id: number) => {
      return React.createElement(
        el.type,
        {key: `head#${id}`, ... createAttributesObject(el) },
        el.innerHTML.length > 0 ? el.innerHTML : undefined
      )
    })

    const elementsToAdd = headElements.filter((reactEl) => {
      return reactEl.type !== 'script' || (reactEl.props.src ? !reactEl.props.src.includes('render-extension-loader.js') : true)
    })

    return (
      <Helmet>
        <html lang={`${this.language}`}></html>
        { elementsToAdd }
      </Helmet>
    )
  }

  public getBodyScripts() {

    const scriptsToReplace: ScriptToReplace[] = [
      {
        replacer: (el: HTMLElementSimplified) => ({ ...el, innerHTML: extensionLoaderScript}),
        shouldReplace: (el: HTMLElementSimplified) => {
          const attrs = pairsToObject(el.attributes)
          return attrs['data-render-loader-script'] && attrs['data-render-loader-script'] === 'true'
        },
      },
      {
        replacer: forceToWaitDOMContentLoaded,
        shouldReplace: (el: HTMLElementSimplified) => {
          return el.innerHTML.includes('vtexid')
        },
      },
    ]

    const correctedBodyScripts = R.map((el: HTMLElementSimplified) => {
      const firstSatisfiedReplaceOption = R.find((candidate: ScriptToReplace) => {
        return candidate.shouldReplace(el)
      }, scriptsToReplace)
      return firstSatisfiedReplaceOption ? firstSatisfiedReplaceOption.replacer(el) : el
    }, this.bodyScripts)

    return correctedBodyScripts.map((el: HTMLElementSimplified, index: number) => {
      return createHtmlElement(withDefer(el), index)
    })

  }
}

export default HtmlPageBuilder
