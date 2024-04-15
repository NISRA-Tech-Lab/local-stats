# nisra-geog-explorer
An explorer for NISRA's key statistics

This is a development repo. Final releases will be via a public repo.

## Instructions for changing prerender of app

The current setup of the app is to not prerender each of the `[code]/+page.svelte` files to html. This can be changed to prerender by changing code in the following places:

- in `+layout.js`, uncomment the `export const prerender = true;` line
- in `svelte.config.js`, uncomment `prerender: { entries: ["*"]},`
- in `svelte.config.js`, swap the arguments for `paths.base` just below the previous entries option
