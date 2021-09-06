const CompressionWebpackPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// vue.config.js for less-loader@6.0.0
module.exports = {
  publicPath: './',
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
            }),
        );
        config.devtool = false;
    }
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
          },
          javascriptEnabled: true,
        },
      },
    },
  },
};