const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const resolve = (rel) => path.resolve(__dirname, '..', rel)

const load = (test, ...use) => ({test, use, exclude: /node_modules/})

module.exports = (env) => ({
	mode: env.prod ? 'production' : 'development',
	devtool: env.prod ? 'cheap-eval-source-map' : 'source-map',
	entry: env.prod ? resolve('src/vue-hybrids.ts') : resolve('src/main.ts'),
	output: {
		path: resolve('dist'),
		filename: env.prod ? `vue-hybrids.min.js` : `vue-hybrids.js`,
		library: `vue-hybrids`,
		libraryTarget: 'umd',
	},
	module: {
		rules: [
			load(/\.vue$/, 'vue-loader'),
			load(/\.(j|t)s?$/, 'babel-loader'),
			load(/\.styl(us)?$/, 'css-loader', 'stylus-loader'),
			load(/\.css$/, 'css-loader'),
		]
	},
	resolve: {
		extensions: ['.ts', '.js', '.json', '.styl', '.css'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'src': resolve('src'),
			'style': resolve('src/style'),
		},
	},
	plugins: [
		new VueLoaderPlugin(),
		env.dev ? new HtmlWebpackPlugin({
			template: resolve('build/template.html'),
			inject: 'body',
		}) : {apply: () => null},
	],
	devServer: {
		port: 9001,
		historyApiFallback: true,
	},
})
