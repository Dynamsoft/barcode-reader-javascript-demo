const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// vue.config.js for less-loader@6.0.0
module.exports = {
  publicPath: "/barcode-reader-js/",
  
  outputDir: "dist/barcode-reader-js/",

  configureWebpack: config=>{
    if(config.mode === "production"){
        config.devtool = false;

        config.plugins.push(
          new UglifyJsPlugin({
            uglifyOptions: {
              output: {
                comments: false,
            },
            compress: {
                drop_debugger: true,
                // drop_console: true, 
            },
            },
            parallel: true,
          })
        );	
    }
  },
  devServer: {
    https: true,
  },
  chainWebpack: config => {
    config.plugins.delete('preload');
    config.plugins.delete('prefetch');
    config.optimization.minimize(true);
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          // If you are using less-loader@5 please spread the lessOptions to options directly
          modifyVars: {
            'primary-color': '#FE8E14',
            'border-radius-base': '2px',
            'border-color-split': 'rgba(34, 34, 34, 0.8)',
            'popover-bg': 'rgba(50, 50, 52, .8)',
            "dropdown-edge-child-vertical-padding": "0",
            'checkbox-check-color': 'rgba(50, 50, 52, .8)',
            'checkbox-border-width': '1px',
            'border-color-base': '#999999',
            'link-hover-color': 'none',
            'link-active-color': 'none',
          },
          javascriptEnabled: true,
        },
      },
    },
  },
  productionSourceMap: false,
};