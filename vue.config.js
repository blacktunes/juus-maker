const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.module
      .rule('text')
      .test(/\.txt$/)
      .use('txt-loader')
      .loader('./plugins/txt-loader')
      .end()
  }
})
