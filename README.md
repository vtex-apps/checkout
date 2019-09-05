# VTEX Checkout

## Orchestrators
```
store
└── order-manager (contains order-queue and order-form)
    ├── order-items
    ├── order-shipping
    ├── order-profile
    └── order-payment
```

## Components and data (BFF - Backend For Frontend)
```
checkout-graphql
 |
 ▼
checkout
└── checkout-cart (provides order-queue, order-form)
    ├── product-list (controlled by order-items)
    ├── checkout-summary
    |   └── checkout-coupon (controlled by order-coupon)
    └── shipping-calculator (controlled by order-shipping)
        └── address-form

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

## UI components
- [checkout](https://github.com/vtex-apps/checkout)
- [checkout-cart](https://github.com/vtex-apps/checkout-cart)
- [checkout-summary](https://github.com/vtex-apps/checkout-summary)
- [checkout-coupon](https://github.com/vtex-apps/checkout-coupon)
- [product-list](https://github.com/vtex-apps/product-list)
- [shipping-calculator](https://github.com/vtex-apps/shipping-calculator)

## BFF
- [checkout-graphql](https://github.com/vtex/checkout-graphql)
