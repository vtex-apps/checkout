import React, { Component, Fragment } from 'react'

const addScopedTachyonsClass = (querySelector: string) => {
    const el = document.querySelector(`${querySelector}`)
    if(el) {
      el.classList.add('scoped-tachyons')
    }
}

const addScopedTachyonsClassSSR = (querySelector: string) => `
  (function() {
    const el = document.querySelector("${querySelector}");
    if(el) {
      el.classList.add('scoped-tachyons')
    }
  })()
`

interface Props {
  selectors: string[],
}

class ScopedTachyonsClassAdder extends Component<Props> {

  public componentDidMount() {
    this.props.selectors.forEach(selector => {
      addScopedTachyonsClass(selector)
    })
  }

  public render() {
    return this.props.selectors.map((selector, id) =>
      <script key={id} dangerouslySetInnerHTML={ { __html: addScopedTachyonsClassSSR(selector) } }/>
    )
  }
}

export default ScopedTachyonsClassAdder
