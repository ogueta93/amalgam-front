module.exports = {
    devServer: {
		open: process.platform === 'darwin',
		host: '',
		port: 4545,
		https: false,
		hotOnly: false,
	},

    css: {
		modules: true,
		loaderOptions: {
			css: {
				data: `@import "@/assets/css/app.css";`
			},
			sass: {
				data: `@import "@/assets/css/app.scss";`
			}
		}
	},

    pluginOptions: {
      i18n: {
        locale: 'en',
        fallbackLocale: 'en',
        localeDir: 'locales',
        enableInSFC: true
      }
    }
}
