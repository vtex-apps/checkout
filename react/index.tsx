import React, { Component, Fragment } from 'react'
import { Query } from 'react-apollo'

import HtmlPageBuilder from './core/HtmlPageBuilder'
import CheckoutHtml from './queries/CheckoutHtml.graphql'

const getUtm = (props: any): UTM => {
  const { query } = props
  return {
    campaign: query.utm_campaign || null,
    medium: query.utm_medium || null,
    source: query.utm_source || null,
  }
}

class Checkout extends Component {

  private utm: UTM

  constructor(props: any) {
    super(props)
    this.utm = getUtm(props)
  }

  public shouldComponentUpdate() {
    return false
  }

  public render () {
    return (
        <Query query={CheckoutHtml} variables={ {major: 5, environment: 'stable', utm: this.utm } }>
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
