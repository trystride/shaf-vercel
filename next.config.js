const withBundleAnalyzer = require('@next/bundle-analyzer')({  
  enabled: process.env.ANALYZE === 'true',
});

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
	webpack: (config, { isServer, dev }) => {
		// Exclude problematic files from being processed
		config.module.rules.push({
			test: /node-pre-gyp.*\.html$/,
			use: 'null-loader',
		});

		if (!isServer) {
			// Add comprehensive fallbacks for Node.js modules that shouldn't be bundled for the client
			config.resolve.fallback = {
				...config.resolve.fallback, // Preserve existing fallbacks if any
				_http_common: false,        // Target of the error
				http: false,                // Often related
				https: false,               // Often related
				zlib: false,                // Sometimes pulled in by http/s related libs
				stream: false,              // Often related
				util: false,                // General Node utility
				crypto: false,              // bcrypt might try to pull this if misconfigured for client
				os: false,
				path: false,
				fs: false,                  // Definitely server-side
				net: false,                 // Server-side
				tls: false,                 // Server-side
				child_process: false,       // Server-side
				'node-gyp-build': false    // For bcrypt/node-pre-gyp
			};

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

module.exports = withBundleAnalyzer(nextConfig);
