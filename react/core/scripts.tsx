const extensionLoaderScript = '\n\
  (function(global) {\n\
    var domResolve;\n\
    global.vtex.renderLoaderPromise = new Promise(function(resolve, reject) {\n\
      domResolve = resolve;\
    });\n\
    document.addEventListener("DOMContentLoaded", domResolve);\n\
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

const changeLangScript = (lang: string) => {
  return `\n\
    (function() {\n\
      var htmlDomNode = document.getElementsByTagName('html')[0];\n\
      htmlDomNode.setAttribute('lang', '${lang}')\n\
    })()\n\
  `
}

export {
  changeLangScript,
  extensionLoaderScript
}
