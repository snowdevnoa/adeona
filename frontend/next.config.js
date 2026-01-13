// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			issuer: /\.[jt]sx?$/,
			use: [{
                    loader: "@svgr/webpack",
                    options: {
                        // Removes the hardcoded width/height from your SVG file
                        dimensions: false,
                        svgoConfig: {
                            plugins: [
                                {
                                    name: "preset-default",
                                    params: {
                                        overrides: {
                                            // Prevents the viewBox from being stripped
                                            removeViewBox: false,
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },],
		});
		return config;
	},
};

module.exports = nextConfig;
