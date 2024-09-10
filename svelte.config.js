/** @type {import('@sveltejs/kit').Config} */
import adapter from '@sveltejs/adapter-static';

const production = process.env.NODE_ENV === 'production';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		adapter: adapter({
			// Options below are defaults
			pages: 'build',
			assets: 'build',
			fallback: '404.html'
		}),
		// need switched on to allow prerender
		// prerender: {
		// 		entries: ["*"]
		// },
		paths: {
				assets: production ? 'https://NISRA-Tech-Lab.github.io/local-stats-dev' : '',
				// to allow a prerender app to be built, the below two arguments need to be swapped
				// base: production ? '' : '/local-stats-dev'
				base: production ? '/local-stats-dev' : ''
		}
	}
};

export default config;
