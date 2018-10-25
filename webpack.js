const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	entry:{
		app:'./app.js'
	},
	output:{
		filename:'./docs/[name].min.js',
		library:'[name]',
		path:__dirname
	},
	plugins:[
		new ExtractTextPlugin({filename: './docs/[name].min.css'})
	],
	args:{}
}
