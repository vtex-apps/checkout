import React, { Component, Fragment } from 'react'
import { Query } from 'react-apollo'

import { canUseDOM } from 'vtex.render-runtime'
import HtmlPageBuilder from './core/HtmlPageBuilder'
import CheckoutHtml from './queries/CheckoutHtml.graphql'


const getUtm = (props: any): UTM => {
  const { query } = props
  return {
    campaign: query.utm_campaign || '',
    medium: query.utm_medium || '',
    source: query.utm_source || '',
  }
}
class Checkout extends Component {

  private utm: UTM
  private isDreamstore: boolean
  private htmlPageBuilder: HtmlPageBuilder

  constructor(props: any) {
    super(props)
    this.utm = getUtm(props)
    this.isDreamstore = props.page === 'store.checkout'
  }

  public shouldComponentUpdate() {
    return false
  }

  public componentWillUnmount() {
    console.log("----------------CHECKOUT UNMOUNT------------")
  }

  public componentDidMount() {
    console.log("----------------CHECKOUT MOUNT------------")

    window.$('.checkout-app').addClass(
      window.location.host.replace(/\./g, '-')
    )

    // console.log(window.vtex.renderLoaderPromise)
    // if(document.readyState === 'loading') {
    //   // document.addEventListener('DOMContentLoaded', this.addScripts)
    //   document.addEventListener('DOMContentLoaded', this.runDeferredFunctions)
    // } else {
    //   // this.addScripts()
    //   this.runDeferredFunctions()
    // }
  }

  public runDeferredFunctions() {

    console.log('Promise', this.checkoutAppPromise)

    this.checkoutAppPromise.then(() => {
      window.vtex.renderLoaderPromise.functionsToExecute.forEach((func) => {
        console.log(func)
        func()
      })
    })
  }

  public render () {

    console.log("--------------- RENDER ------------")

    // if(canUseDOM) {
    //   this.checkoutAppPromise = new Promise((resolve) => {
    //     global.vtex.resolveCheckoutAppPromise = () => {
    //       console.log("Resolve checkoutAppPromise", window.vtex.renderLoaderPromise.functionsToExecute)
    //       resolve()
    //     }
    //   })
    // }

    return (
        <Query query={CheckoutHtml} variables={ { isDreamstore: this.isDreamstore, environment: 'stable', utm: this.utm } }>
          {({ loading, error, data}) => {
            if(loading || error) {
              return ''
            }
            this.htmlPageBuilder = new HtmlPageBuilder(data.checkoutHtml)
            return (
              <Fragment>
                { this.htmlPageBuilder.getHelmetHead() }
                { this.htmlPageBuilder.getBody() }
              </Fragment>
            )
          }}
        </Query>
    )
  }
}

export default Checkout
