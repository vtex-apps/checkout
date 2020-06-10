# VTEX Checkout

## Orchestrators

```
store
└── order-manager (contains order-queue and order-form)
    ├── order-items
    ├── order-shipping
    ├── order-profile
    ├── order-payment
    └── checkout-container
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
|       └── address-form
|
└── checkout-container (provides utilities used by the checkout steps)
    ├── checkout-identification
    └── checkout-step-group
        ├── checkout-profile (contains the profile form)
        ├── checkout-shipping (contains the shipping form)
        └── checkout-payment (contains the payment form)
... to be continued
```

## GraphQL operations
All GraphQL queries and mutations used by Checkout IO are located in [`checkout-resources`](https://github.com/vtex-apps/checkout-resources). This makes it possible to reuse GraphQL fragments and avoid duplicating the response for each query/mutation.

## Dependencies
- [shipping-estimate-translator](https://github.com/vtex-apps/shipping-estimate-translator)
- [format-currency](https://github.com/vtex-apps/format-currency)
- [price](https://github.com/vtex-apps/price)
- [checkout-resources](https://github.com/vtex-apps/checkout-resources)

## Orchestrators
- [order-manager](https://github.com/vtex-apps/order-manager)
- [order-coupon](https://github.com/vtex-apps/order-coupon)
- [order-items](https://github.com/vtex-apps/order-items)
- [order-profile](https://github.com/vtex-apps/order-profile)

## UI components
- [checkout](https://github.com/vtex-apps/checkout)
- [checkout-container](https://github.com/vtex/checkout-container)
- [checkout-cart](https://github.com/vtex-apps/checkout-cart)
- [product-list](https://github.com/vtex-apps/product-list)
- [shipping-calculator](https://github.com/vtex-apps/shipping-calculator)
- [checkout-summary](https://github.com/vtex-apps/checkout-summary)
- [checkout-coupon](https://github.com/vtex-apps/checkout-coupon)
- [checkout-step-group](https://github.com/vtex-apps/checkout-step-group)
- [checkout-identification](https://github.com/vtex-apps/checkout-identification)
- [checkout-profile](https://github.com/vtex-apps/checkout-profile)
- [checkout-shipping](https://github.com/vtex-apps/checkout-shipping)
- [checkout-payment](https://github.com/vtex-apps/checkout-payment)

## BFF
- [checkout-graphql](https://github.com/vtex/checkout-graphql)
- [gateway-graphql](https://github.com/vtex/gateway-graphql)
- [places-graphql](https://github.com/vtex-apps/places-graphql)

## Extra
- [checkout-fullstory](https://github.com/vtex-apps/checkout-fullstory)
- [checkout-io-tests](https://github.com/vtex-apps/checkout-io-tests)
