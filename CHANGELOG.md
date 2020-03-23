# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
