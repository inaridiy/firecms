import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	build: {},
	plugins: [sveltekit()]
};

export default config;
