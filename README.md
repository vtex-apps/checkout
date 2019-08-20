# VTEX Checkout

## Orchestrators
```
store
└── order-manager
    ├── order-items
    ├── order-summary
    ├── order-shipping
    ├── order-profile
    └── order-payment
```

## Components and data (BFF - Backend For Frontend)
```
checkout-graphql
 |
 ▼
checkout (order-manager)
└── checkout-cart
    ├── product-list (order-items)
    ├── checkout-summary (order-summary)
    |   └── checkout-coupon
    └── shipping-calculator (order-shipping)
        └── address-form

... to be continued
```

## Dependencies

- [shipping-estimate-translator](https://github.com/vtex-apps/shipping-estimate-translator)
- [format-currency](https://github.com/vtex-apps/format-currency)

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
