# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.7.1] - 2020-07-14
### Changed
- Rename route `store.checkout.container` to `store.checkout.order-form`.

## [2.7.0] - 2020-07-08
### Changed
- Display error alert in case of failure in the place order flow.

## [2.6.1] - 2020-06-29
### Changed
- Fixed `post-robot` package version at `10.0.35` to avoid issues with mismatching versions between different checkout apps.

## [2.6.0] - 2020-06-22
### Added
- Support for payment methods without sensitive data.

## [2.5.0] - 2020-06-05
### Added
- Click handler to place order button, and start the purchase completion flow.

## [2.4.5] - 2020-05-08
### Fixed
- Payment step crashing when resizing window from mobile to desktop.

## [2.4.4] - 2020-05-06
### Changed
- Updated place order button to only appear on review route.

## [2.4.3] - 2020-05-06
### Added
- Animation to items summary.

### Fixed
- Layout overflow and a one pixel line right beside the summary.

## [2.4.2] - 2020-04-22
### Added
- Sales disclaimer in footer.
- View cart button in summary review step.

### Fixed
- Footer alignment on mobile.
- Alignment of open cart button in header.
- Sidebar padding in bigger breakpoints.
- Max width of container.
- Ratio width between checkout and sidebar on desktop.

## [2.4.1] - 2020-03-23
### Changed
- Use custom container measurements in the container flex-layout.

## [2.4.0] - 2020-03-13
### Added
- Implementation for the drawer and items summary in mobile devices.

## [2.3.0] - 2020-03-11
### Added
- Mobile layout for checkout page.

## [2.2.0] - 2020-03-10
### Added
- Basic layout for new checkout page.

## [2.1.0] - 2020-03-03
### Added
- Route `/checkout/identification` to render the new identification page.
- Dependency `vtex.checkout-identification`.

## [2.0.0] - 2020-02-27
### Added
- Route `/checkout` to point to the new Checkout implementation.
- Store interface `store.checkout.container` to render the new route.

### Changed
- Upgrade to node builder 4.x.

## [1.1.0] - 2019-10-31
### Added
- Route `/cart/add` that allows adding items to cart via query string.

## [1.0.2] - 2019-10-25
### Added
- Settings schema for checkout v6 to identify the new checkout is installed

## [1.0.1] - 2019-08-20
### Changed
- App purpose to be new checkout main app.
