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
        }
      }
    }
  },
  configureWebpack :{
    plugins: [
      new webpack.DefinePlugin({
        'process.env.VUE_APP_BASE_URL': JSON.stringify(process.env.VUE_APP_BASE_URL)
      })
    ]
  }
})
