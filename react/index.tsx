import React, { Component, Fragment } from 'react'
import { Query } from 'react-apollo'

import HtmlPageBuilder from './core/HtmlPageBuilder'
import CheckoutHtml from './queries/CheckoutHtml.graphql'

class Checkout extends Component {

  public shouldComponentUpdate() {
    return false
  }

  public render () {
    return (
        <Query query={CheckoutHtml} variables={ {major: 5, environment: 'stable'} }>
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
