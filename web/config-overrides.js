const {
    fixBabelImports,
    override,
    addDecoratorsLegacy,
    addLessLoader,
    disableEsLint,
    addBundleVisualizer,
    addWebpackAlias,
    adjustWorkbox
  } = require("customize-cra");
  const path = require("path");
  
  module.exports = override(
      
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
    }),

    addLessLoader({
        strictMath: true,
        noIeCompat: true,
        javascriptEnabled: true,
        modifyVars: {             
        '@primary-color': '#379266',
        '@link-color': '#ee5e7b',
        '@btn-primary-bg': 'ee5e7b',
      }
    }),

    // enable legacy decorators babel plugin
    addDecoratorsLegacy(),
  
    // disable eslint in webpack
    disableEsLint(),
  
    // add webpack bundle visualizer if BUNDLE_VISUALIZE flag is enabled
    // process.env.BUNDLE_VISUALIZE == 1 && addBundleVisualizer(),
    // addBundleVisualizer(),
    // add an alias for "ag-grid-react" imports
    addWebpackAlias({
      ["ag-grid-react$"]: path.resolve(__dirname, "src/shared/agGridWrapper.js")
    }),
  
    // adjust the underlying workbox
    adjustWorkbox(wb =>
      Object.assign(wb, {
        skipWaiting: true,
        exclude: (wb.exclude || []).concat("index.html")
      })
    )
  );
