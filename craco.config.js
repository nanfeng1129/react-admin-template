const CracoLessPlugin = require('craco-less');
const { resolve } = require("path")

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1890ff' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@m': resolve(__dirname, 'src/modules')
    }
  },
  devServer: {
    port: 9999,
  }
};