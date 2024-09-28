const { defineConfig } = require('@vue/cli-service')
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
  }
})
