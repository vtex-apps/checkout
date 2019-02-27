const createRenderLoaderPromise = `\n\
  (function(global) {\n\
    global.vtex.renderLoaderPromise = new Promise(function(resolve, reject) {\n\
      document.addEventListener("DOMContentLoaded", resolve);\n\
    });\n\
    // global.vtex.renderLoaderPromise = {\n\
    //   functionsToExecute: [],\n\
    //   then: function(func) {\n\
    //     this.functionsToExecute.push(func)\n\
    //   }\n\
    // };\n\
  })(this);\n\
`

const defineRenderRuntimeAndRenderLoader = '\n\
  (function(global) {\n\
    global.vtex.renderLoaderPromise.then(function() {\n\
      global.vtex.renderRuntime = global.__RUNTIME__;\n\
      global.vtex.renderLoader = {\n\
        render: function(extensionName, htmlElement, props = {}) {\n\
          const runtime = global[`__RENDER_${global.__RUNTIME__.renderMajor}_RUNTIME__`];\n\
          runtime.renderExtension(extensionName, htmlElement, props);\n\
        }\n\
      };\n\
    });\n\
  })(this);\n\
'

const deleteTachyons = `
  document.addEventListener('DOMContentLoaded', function() {
    const deleteElem = (el) => {
      if(!el.id || el.id != 'scoped-tachyons') {
        el.parentNode.removeChild(el);
      }
    }
    const tachyons = document.querySelectorAll("[href*=styles-graphql]");
    const tachyons2 = document.querySelectorAll("[href*=vtex-tachyons]");
    tachyons2.forEach((el) => {
      deleteElem(el);
    });
    tachyons.forEach((el) => {
      deleteElem(el)
    });
  });
`

const addTachyonsScoped = `
  (function() {
    const tachyons = document.querySelectorAll("[href*=styles-graphql]");
    const link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = tachyons[0].href + '&namespace=scoped-tachyons';
    link.id = "scoped-tachyons"
    document.head.appendChild(link);
  })()
`

const extensionLoaderScript = (
  createRenderLoaderPromise
  + defineRenderRuntimeAndRenderLoader
)

export {
  extensionLoaderScript,
  addTachyonsScoped,
  deleteTachyons
}
