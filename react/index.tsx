import React, { Component, Fragment } from 'react'
import { Query } from 'react-apollo'

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

  constructor(props: any) {
    super(props)
    this.utm = getUtm(props)
    this.isDreamstore = props.page === 'store.checkout'
  }

  public shouldComponentUpdate() {
    return false
  }

  public componentDidMount() {
    window.$('.checkout-app').addClass(
      window.location.host.replace(/\./g, '-')
    )
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
    return (
        <Query query={CheckoutHtml} variables={ { isDreamstore: this.isDreamstore, environment: 'stable', utm: this.utm } }>
          {({ loading, error, data}) => {
            if(loading || error) {
              return ''
            }
            const htmlPageBuilder = new HtmlPageBuilder(data.checkoutHtml)
            return (
              <Fragment>
                { htmlPageBuilder.getHelmetHead() }
                { htmlPageBuilder.getBody() }
              </Fragment>
            )
          }}
        </Query>
    )
  }
}

export default Checkout
