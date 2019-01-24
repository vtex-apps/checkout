const extensionLoaderScript = '\n\
  (function(global) {\n\
    global.vtex.renderLoaderPromise = new Promise(function(resolve, reject) {\n\
      document.addEventListener("DOMContentLoaded", resolve);\n\
    });\n\
    global.vtex.renderLoaderPromise.then(function() {\n\
      global.vtex.renderRuntime = global.__RUNTIME__;\n\
      global.vtex.renderLoader = {\n\
        render: function(extension, element, props = {}) {\n\
          const runtime = global[`__RENDER_${global.__RUNTIME__.renderMajor}_RUNTIME__`];\n\
          console.log("BORA RENDERIZAR!!!")\n\
          runtime.renderExtension(extension, element, props)\n\
        },\n\
        update: function() {\n\
  \n\
        }\n\
      }\n\
    });\n\
  })(this)\n\
'

export {
  extensionLoaderScript
}
