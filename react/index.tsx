import React, { Component, Fragment } from 'react'
import { Query } from 'react-apollo'

import HtmlPageBuilder from './core/HtmlPageBuilder'
import CheckoutHtml from './queries/CheckoutHtml.graphql'

interface Props {
  page: string,
  query?: Record<string, string>
}

const getUtm = (props: Props): UTM => {
  const { query } = props
  return {
    campaign: query && query.utm_campaign || '',
    medium: query && query.utm_medium || '',
    source: query && query.utm_source || '',
  }
}

class Checkout extends Component<Props> {

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
    document.readyState !== 'loading' ?
      this.postPageLoad() :
      document.addEventListener('DOMContentLoaded', this.postPageLoad)
  }

  public postPageLoad = () => {
    window.$('.checkout-app').addClass(
      window.location.host.replace(/\./g, '-')
    )
  }

  public render() {
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
