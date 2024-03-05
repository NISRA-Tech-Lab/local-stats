/** @type {import('@sveltejs/kit').Config} */
import adapter from '@sveltejs/adapter-static';

const production = process.env.NODE_ENV === 'production';

const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		adapter: adapter({
			// Options below are defaults
			pages: 'build',
			assets: 'build',
			fallback: '404.html'
		}),
		paths: {
				assets: production ? 'https://mairebrolly.github.io/nisra-explorer' : '',
				base: production ? '/nisra-explorer' : ''
		}
	}
};

export default config;
