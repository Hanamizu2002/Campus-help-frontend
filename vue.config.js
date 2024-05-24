const path = require('path');
module.exports = {
	publicPath: './',
	// 输出文件目录
	outputDir: 'dist',
	// 关闭 ESLint 语法检测功能
	lintOnSave: false,
	// 开发服务器相关的配置
	devServer: {
		// 配置静态资源目录
		static: {
			directory: path.join(__dirname, 'public'),
		},
		// 默认启动打开浏览器
		open: true,
		// 设置开发服务器的端口号
		port: 8848,
		// 其他可能需要的配置
		hot: true,
		historyApiFallback: true
	},
	configureWebpack: {
		// 解析
		resolve: {
			// 配置路径别名
			alias: {
				// 全部视图
				'@v': path.resolve(__dirname, 'src/views'),
				// 全部组件
				"@c": path.resolve(__dirname, 'src/components'),
				// src路径
				"@s": path.resolve(__dirname, 'src'),
				// assets
				"@a": path.resolve(__dirname, 'src/assets'),
			},
			fallback: { "querystring": require.resolve("querystring-es3") }
		}
	}
}
