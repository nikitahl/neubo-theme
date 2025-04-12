const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'

  return {
    mode: isProduction ? 'production' : 'development',
    devtool: false,
    entry: {
      customizer: './js/customizer.js',
      navigation: './js/navigation.js',
      styles: './js/styles.js'
    },
    output: {
      filename: (pathData) => {
        return pathData.chunk.name === 'styles'
          ? '../noop.js' // optional dummy file, or filter out manually
          : '[name].min.js'
      },
      path: path.resolve(__dirname, 'js')
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '../css/[name].min.css'
      })
    ],
    optimization: {
      minimize: isProduction, // Minify only in production
      minimizer: isProduction ? [ new TerserPlugin(), new CssMinimizerPlugin() ] : []
    },
    watch: !isProduction // Enable watch mode in development
  }
}
