module.exports = {
  mode: 'development',
  entry: [
    'babel-regenerator-runtime',
    __dirname + '/resources/js/app.js'
  ],
  output: {
    path: __dirname + '/public/js',
    publicPath: '/public/',
    filename: 'app.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    }]
  }
};
