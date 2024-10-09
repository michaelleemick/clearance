const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer:{
    proxy:{
      '/api' :{
        target: 'http://121.41.167.176:20001',
        changeOrigin: true,
        pathRewrite:{
          '^/api': ''
        },
        onProxyReq(proxyReq){
          proxyReq.removeHeader('origin') 
        },
      }
    },
    // onProxyReq(proxyReq){
    //   proxyReq.removeHeader('origin') 
    // },
    // onProxyReq(proxyReq) {
    //   if (proxyReq.getHeader("origin")) {
    //     proxyReq.setHeader("origin", target)
    //   }
    // }
  },
  
})
// configureWebpack :{
  //   plugins: [
  //     new webpack.DefinePlugin({
  //       'process.env.VUE_APP_BASE_URL': JSON.stringify(process.env.VUE_APP_BASE_URL)
  //     })
  //   ]
  // }