var path = require("path");
var pkg = require("./package.json");

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var LiveReloadPlugin = require('webpack-livereload-plugin');

var config = {
  entry: pkg.main,
  output: {
    path: path.join(__dirname, 'codebase'),
    publicPath:"/codebase/",
    filename: pkg.main
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
      	test: /\.(png|jpg|gif)$/,
      	use: 'url-loader?limit=25000'
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
        	use: [
        		"css-loader",
				"less-loader"
			]
        })
      },
      {
        test: /\.html$/,
        use: "handlebars-loader"
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
    modules: ["sources", "node_modules"]
  },
  devServer:{
    proxy: {
      '/server/*': pkg.localURL
    }
  },
  plugins: [
    new ExtractTextPlugin({
    	filename:pkg.main.replace(".js", ".css")
	}),
    new LiveReloadPlugin()
  ]
};

module.exports = config;