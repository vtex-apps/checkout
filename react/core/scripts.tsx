const createRenderLoaderPromise = '\n\
  (function(global) {\n\
    global.vtex.renderLoaderPromise = new Promise(function(resolve, reject) {\n\
      document.addEventListener("DOMContentLoaded", resolve);\n\
    });\n\
  })(this);\n\
'

const defineRenderRuntimeAndRenderLoader = '\n\
  (function(global) {\n\
    global.vtex.renderLoaderPromise.then(function() {\n\
      global.vtex.renderRuntime = global.__RUNTIME__;\n\
      global.vtex.renderLoader = {\n\
        render: function(extensionName, htmlElement, props = {}) {\n\
          originalExtensionName = extensionName.replace(\'checkout/\', \'checkout-render/\');\n\
          const runtime = global[`__RENDER_${global.__RUNTIME__.renderMajor}_RUNTIME__`];\n\
          runtime.renderExtension(originalExtensionName, htmlElement, props);\n\
        }\n\
      };\n\
    });\n\
  })(this);\n\
'

const changeRenderExtensionsKeys = '\n\
  (function(global) {\n\
    global.vtex.renderLoaderPromise.then(function() {\n\
      const extensionsRenamed = {};\n\
      Object.keys(global.vtex.renderRuntime.extensions).forEach((extensionName) => {\n\
        extensionsRenamed[extensionName.replace(\'checkout-render/\', \'checkout/\')] = global.vtex.renderRuntime.extensions[extensionName];\n\
      });\n\
      global.vtex.renderRuntime.extensions = extensionsRenamed;\n\
    });\n\
  })(this);\n\
'

const extensionLoaderScript = (
  createRenderLoaderPromise
  + defineRenderRuntimeAndRenderLoader
  + changeRenderExtensionsKeys
)

export {
  extensionLoaderScript,
}
