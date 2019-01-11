import * as R from 'ramda'
import React, { createElement, Fragment } from 'react'
import { Helmet } from 'render'

import { changeLangScript, extensionLoaderScript } from './scripts'

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

const createAttributesObject = (el: SimplifiedHTMLElement, headFlag: boolean) => {
  const { type, attributes, innerHTML } = el
  return {
    ... (!innerHTML || innerHTML === '') ? {} : ( headFlag ? { innerHTML } : { dangerouslySetInnerHTML: {__html: innerHTML} } ),
    ... pairsToObject(attributes),
  }
}

const createHtmlElement = (el: SimplifiedHTMLElement , index: number, headFlag = false) => {
  return createElement(el.type, {
    key: index,
    ... createAttributesObject(el, headFlag),
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
  const ret = (el.innerHTML.length > 0) ? el : { ...el, attributes: R.append({key: 'defer', value: true}, el.attributes)}
  return ret
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
        <script dangerouslySetInnerHTML={{__html: changeLangScript(this.language)}}></script>
        <div dangerouslySetInnerHTML={{__html: this.body}}></div>
        { this.getBodyScripts() }
      </Fragment>
    )
  }

  public getHelmetHead() {
    const uniqueTags = [... new Set(R.map((el: SimplifiedHTMLElement) => {
      return el.type
    }, this.head))]

    const headGroupedByTag: any = R.reduce((acc: any, tag: string) => {
      const tagElements: SimplifiedHTMLElement[] = R.filter((el: SimplifiedHTMLElement) => el.type === tag, this.head)
      return {
        ...acc,
        [tag]: R.map((el: SimplifiedHTMLElement) => createAttributesObject(el, true), tagElements),
      }
    }, {}, uniqueTags)

    const scriptFilteredHead = {
      ... headGroupedByTag,
      script: R.filter((script: any) => {
        return script.src ? !script.src.includes('render-extension-loader.js') : true
      }, headGroupedByTag.script),
    }

    console.log(scriptFilteredHead)
    return React.createElement(
      Helmet,
      scriptFilteredHead,
      null
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
