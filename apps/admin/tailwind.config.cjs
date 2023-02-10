/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				content: 'var(--color-text)',
				neutral: 'var(--color-neutral)',
				'neutral-content': 'var(--color-neutral-content)',
				primary: 'var(--color-primary)',
				'primary-content': 'var(--color-primary-content)',
				secondary: 'var(--color-secondary)',
				'secondary-contetn': 'var(--color-secondary-content)'
			}
		}
	},
	plugins: []
};
