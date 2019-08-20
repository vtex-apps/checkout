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
