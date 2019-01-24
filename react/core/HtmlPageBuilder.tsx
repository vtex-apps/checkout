import * as R from 'ramda'
import React, { Fragment } from 'react'
import { Helmet } from 'render'

import { extensionLoaderScript } from './scripts'

interface ScriptToReplace {
  shouldReplace: (el: SimplifiedHTMLElement) => boolean,
  replacer: (el: SimplifiedHTMLElement) => SimplifiedHTMLElement
}

const pairsToObject = (arr : Pair[]) => {
  return R.reduce((acc: any, prop: Pair) => {
    return {
      ... acc,
      [prop.key]: prop.value,
    }
  }, {}, arr) as any
}

const createAttributesObject = (el: SimplifiedHTMLElement) => {
  return pairsToObject(el.attributes)
}

const createHtmlElement = (el: SimplifiedHTMLElement , index: number) => {
  const { type, innerHTML } = el
  return React.createElement(type, {
    key: index,
    ... createAttributesObject(el),
    ... innerHTML.length > 0 ? { dangerouslySetInnerHTML: { __html: innerHTML } } : {},
  })
}

const forceToWaitDOMContentLoaded = (el: SimplifiedHTMLElement): SimplifiedHTMLElement => {
  const innerHTML = `\ndocument.addEventListener("DOMContentLoaded", function() {\n\
    ${el.innerHTML}
  });\n`
  return {
    ...el,
    innerHTML,
  }
}

const withDefer = (el: SimplifiedHTMLElement): SimplifiedHTMLElement => {
  return (el.innerHTML.length > 0) ? el : { ...el, attributes: R.append({key: 'defer', value: true}, el.attributes)}
}

class HtmlPageBuilder {

  private language: string
  private body: string
  private bodyScripts: SimplifiedHTMLElement[]
  private head: SimplifiedHTMLElement[]

  constructor(dissectedPage: DissectedPage) {
    this.body = dissectedPage.body
    this.bodyScripts = dissectedPage.bodyScripts
    this.head = dissectedPage.head
    this.language = dissectedPage.language
  }

  public getBody() {
    return (
      <Fragment>
        <div dangerouslySetInnerHTML={{__html: this.body}}></div>
        { this.getBodyScripts() }
      </Fragment>
    )
  }

  public getHelmetHead() {
    const headElements = this.head.map((el: SimplifiedHTMLElement, id: number) => {
      return React.createElement(
        el.type,
        {key: `head#${id}`, ... createAttributesObject(el) },
        el.innerHTML.length > 0 ? el.innerHTML : undefined
      )
    })

    const elementsToAdd = headElements.filter((reactEl) => {
      return reactEl.type !== 'script' || (reactEl.props.src ? !reactEl.props.src.includes('render-extension-loader.js') : true)
    })

    console.log('Head', elementsToAdd)
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
        replacer: (el: SimplifiedHTMLElement) => ({ ...el, innerHTML: extensionLoaderScript}),
        shouldReplace: (el: SimplifiedHTMLElement) => {
          const attrs = pairsToObject(el.attributes)
          return attrs['data-render-loader-script'] && attrs['data-render-loader-script'] === 'true'
        },
      },
      {
        replacer: forceToWaitDOMContentLoaded,
        shouldReplace: (el: SimplifiedHTMLElement) => {
          return el.innerHTML.includes('vtexid')
        },
      },
    ]

    const correctedBodyScripts = R.map((el: SimplifiedHTMLElement) => {
      const firstSatisfiedReplaceOption = R.find((candidate: ScriptToReplace) => {
        return candidate.shouldReplace(el)
      }, scriptsToReplace)
      return firstSatisfiedReplaceOption ? firstSatisfiedReplaceOption.replacer(el) : el
    }, this.bodyScripts)

    return correctedBodyScripts.map((el: SimplifiedHTMLElement, index: number) => {
      return createHtmlElement(withDefer(el), index)
    })

  }
}

export default HtmlPageBuilder
