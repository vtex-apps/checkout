# VTEX Checkout

## Warning 🚨

This repository contains **experimental** code for VTEX Checkout.

This code is "experimental" for various reasons:
- Some are not tested as rigorously as the main code.
- Some are tested but not maintained.
- It can suffer from significant changes (breaking changes) without further notice.

The only major we use in production is **0.x**.

**Use it at your own risk!** ☠️

## Controllers

```
store
└── order-manager (contains order-queue and order-form)
    ├── order-items
    ├── order-shipping
    ├── order-profile
    ├── order-payment
    └── checkout-container (router)
```

## Components and data (BFF - Backend For Frontend)

```
checkout-graphql
 |
 ▼
checkout
└── checkout-cart (provides order-queue, order-form)
|   ├── product-list (controlled by order-items)
|   ├── checkout-summary
|   |   └── checkout-coupon (controlled by order-coupon)
|   └── shipping-calculator (controlled by order-shipping)
|       └── checkout-shipping
|
└── checkout-container (provides utilities used by the checkout steps)
    ├── checkout-identification
    └── checkout-step-group
        ├── checkout-profile (contains the profile form)
        ├── checkout-shipping (contains the shipping form and shipping address)
        └── checkout-payment (contains the payment form)
... to be continued
```

## GraphQL operations

All GraphQL queries and mutations used by Checkout IO are located in [`checkout-resources`](https://github.com/vtex-apps/checkout-resources). This makes it possible to reuse GraphQL fragments and avoid duplicating the response for each query/mutation.

## Dependencies

- [shipping-estimate-translator](https://github.com/vtex-apps/shipping-estimate-translator)
- [format-currency](https://github.com/vtex-apps/format-currency)
- [formatted-price](https://github.com/vtex-apps/formatted-price)
- [checkout-resources](https://github.com/vtex-apps/checkout-resources)
- [address-context](https://github.com/vtex-apps/address-context)

## Controllers

- [order-coupon](https://github.com/vtex-apps/order-coupon)
- [order-items](https://github.com/vtex-apps/order-items)
- [order-manager](https://github.com/vtex-apps/order-manager)
- [order-payment](https://github.com/vtex-apps/order-payment)
- [order-profile](https://github.com/vtex-apps/order-profile)
- [order-shipping](https://github.com/vtex-apps/order-shipping)

## UI components

- card-form-ui
- [checkout-cart](https://github.com/vtex-apps/checkout-cart)
- [checkout-components](https://github.com/vtex-apps/checkout-components)
- [checkout-container](https://github.com/vtex/checkout-container)
- [checkout-coupon](https://github.com/vtex-apps/checkout-coupon)
- [checkout-identification](https://github.com/vtex-apps/checkout-identification)
- [checkout-payment](https://github.com/vtex-apps/checkout-payment)
- [checkout-profile](https://github.com/vtex-apps/checkout-profile)
- [checkout-shipping](https://github.com/vtex-apps/checkout-shipping)
- [checkout-step-group](https://github.com/vtex-apps/checkout-step-group)
- [checkout-summary](https://github.com/vtex-apps/checkout-summary)
- [checkout](https://github.com/vtex-apps/checkout)
- [phone-field](https://github.com/vtex-apps/phone-field)
- [place-components](https://github.com/vtex-apps/place-components)
- [product-list](https://github.com/vtex-apps/product-list)
- [shipping-calculator](https://github.com/vtex-apps/shipping-calculator)

## Country-related rules

- [countries-data](https://github.com/vtex-apps/countries-data)
- [country-data-settings](https://github.com/vtex-apps/country-data-settings)
- [country-flags](https://github.com/vtex-apps/country-flags)
- [document-field](https://github.com/vtex-apps/document-field)

## BFF

- [checkout-graphql](https://github.com/vtex/checkout-graphql)
- [gateway-graphql](https://github.com/vtex/gateway-graphql)
- [geolocation-graphql-interface](https://github.com/vtex-apps/geolocation-graphql-interface)
- [google-geolocation-resolver](https://github.com/vtex-apps/google-geolocation-resolver)
- [places-graphql](https://github.com/vtex-apps/places-graphql)

## Extra

- [checkout-cartman](https://github.com/vtex-apps/checkout-cartman)
- [checkout-fullstory](https://github.com/vtex-apps/checkout-fullstory)
- [checkout-io-tests](https://github.com/vtex-apps/checkout-io-tests)
- [checkout-splunk](https://github.com/vtex-apps/checkout-splunk)
