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

class ScopedTachyonsClassAdder extends Component {

  public componentDidMount() {
    this.props.selectors.forEach(selector => {
      addScopedTachyonsClass(selector)
    })
  }

  public render() {
    return (
      <Fragment>
        {
          this.props.selectors.map((selector, id) =>
            <script key={id} dangerouslySetInnerHTML={ { __html: addScopedTachyonsClassSSR(selector) } }/>
          )
        }
      </Fragment>

    )
  }
}

export default ScopedTachyonsClassAdder
