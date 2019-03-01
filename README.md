# VTEX Checkout 1.x

Vtex IO port to SmartCheckout. 

## Building the checkout page

The class responsible for building the page react will render is `HtmlPageBuilder`. 

### Head

The head tags received from `checkoutHtml`'s graphQL query are converted to `React` elements for insertion via `Helmet`.
Before doing this some elements from the original head are filtered out. At the moment only the script for `render-extension-loader`
is removed. This head building is done in the function `getHelmetHead`.

In addition to these elements, a script defined at `react/core/scripts.tsx` is inserted in the head as well: `addTachyonsScoped`. 
Its behavior is to add a `link` tag with a `href` to a scoped tachyons stylesheet.

It's important to note that apparently `script` tags added via `Helmet` receive an additional `defer` prop.

### Body 

The `getBody` function is responsible for building the renderable part of the app:
```
<div className="checkout-app">
  <script dangerouslySetInnerHTML={ { __html: deleteTachyons } }/>
  <div dangerouslySetInnerHTML={ { __html: this.body } } />
  { this.getBodyScripts() }
</div>
```

The body from checkout's HTML is inserted in via `dangerouslySetInnerHTML`. Right before it a script is inserted for deleting
the unscoped tachyons inserted by the `render-server`. After them all body scripts present in the original checkout html are
inserted. 

Some notes about these body scripts is that a `defer` prop is added to all of them. Besides this, in the function `getBodyScripts`
some scripts are replaced. At the moment the scripts replaced are:

- **render-loader-script**: This inline script originally depends on `render-extension-loader`. It defines an interface for `checkout.min.js` to use.
The defined interface creates a promise, the `global.vtex.renderLoaderPromise` and after this promise is resolved, defines `global.vtex.renderLoader`
which is responsible for adding extension points into the current page html elements. The replacer for this script defines the `renderLoaderPromise`,
which resolves on `DOMContentLoaded`, and then defines `global.vtex.renderLoader`. The function `global.vtex.renderLoader.render`, called by `checkout.min.js`
to render checkout extensions, is defined as a call to render-runtime's `renderExtension` function, which creates a `reactPortal` rendering the `ExtensionPoint` into
the desired HTML element.

- **vtex id related inline script**: This inline script was executing before the script defining `vtex-id`, throwing an exception. To solve this,
the inline javascript code is being wrapped by a `DOMContentLoaded` event listener.

## Known Issues

- A fully scoped tachyons is not playing well with checkout's bootstrap. A solution to this would be to just scope tachyons' globally applied properties.
A [feature request](https://github.com/vtex/tachyons-generator/issues/20) was opened on tachyons-generator to take care of this issue. After this, a minor change on `styles-graphql` would be needed too.
- Navigating to another page by clicking on the logo doesn't reload original tachyons, messing up the page style.
- `TypeError: window.$ is not a function`. Sometimes jquery doesn't load for some reason.
