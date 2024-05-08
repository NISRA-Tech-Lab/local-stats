import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
        plugins: [sveltekit()],

        server: {
                    fs: {
                        allow: ['search_data', 'data_jsons','data_jsons_dz', 'alternative_jsons','data_jsons_dea_2202','data_jsons_dea_2302','data_jsons_dea_20240408']
                    }
                }
};



export default config;