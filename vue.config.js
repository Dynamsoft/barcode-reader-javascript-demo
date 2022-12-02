const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// vue.config.js for less-loader@6.0.0
module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH,//"./",

  configureWebpack: config=>{
    if(config.mode === "production"){
        // use gz
        config.plugins.push(
            new CompressionWebpackPlugin({
              exclude: /(\.config)$/,
            }),
        );
        config.plugins.push(
            new BundleAnalyzerPlugin({
              analyzerMode: 'disabled', 
              generateStatsFile: false, 
              deleteOriginalAssets: true
            }),
        );
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
    config.externals = {
      'vue': 'Vue',
      'vuex':'Vuex',
      'clipboard': 'ClipboardJS',
      'dynamsoft-javascript-barcode': 'Dynamsoft.DBR',
      'dynamsoft-code-parser': 'Dynamsoft.DCP'
    }
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