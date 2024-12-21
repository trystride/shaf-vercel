/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['localhost', 'bankruptcy.gov.sa'],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.sanity.io',
				port: '',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				port: '',
			},
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
				port: '',
			},
			{
				protocol: 'https',
				hostname: 'pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev',
				port: '',
			},
			{
				protocol: 'https',
				hostname: 'bankruptcy.gov.sa',
				port: '',
			},
		],
	},
	swcMinify: true,
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
	experimental: {
		optimizeCss: {
			cssModules: true,
		},
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.optimization.splitChunks = {
				chunks: 'all',
				minSize: 20000,
				maxSize: 244000,
				minChunks: 1,
				maxAsyncRequests: 30,
				maxInitialRequests: 30,
				cacheGroups: {
					defaultVendors: {
						test: /[\\/]node_modules[\\/]/,
						priority: -10,
						reuseExistingChunk: true,
					},
					default: {
						minChunks: 2,
						priority: -20,
						reuseExistingChunk: true,
					},
				},
			};
		}
		return config;
	},
	env: {
		PAYLINK_API_ID: process.env.PAYLINK_API_ID,
		PAYLINK_SECRET_KEY: process.env.PAYLINK_SECRET_KEY,
		PAYLINK_BASE_URL: process.env.PAYLINK_BASE_URL,
	},
};

module.exports = nextConfig;
