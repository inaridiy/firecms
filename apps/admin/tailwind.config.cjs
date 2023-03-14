/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ["'Rubik', 'Noto Sans JP', sans-serif", { fontFeatureSettings: '"palt"' }]
			},
			colors: {
				'base-100': 'var(--color-base-100)',
				'base-200': 'var(--color-base-200)',
				'base-300': 'var(--color-base-300)',
				'base-content': 'var(--color-base-content)',
				neutral: 'var(--color-neutral)',
				'neutral-content': 'var(--color-neutral-content)',
				primary: 'var(--color-primary)',
				'primary-content': 'var(--color-primary-content)',
				secondary: 'var(--color-secondary)',
				'secondary-content': 'var(--color-secondary-content)',
				error: 'var(--color-error)'
			},
			borderRadius: {
				box: 'var(--rounded-box)',
				btn: 'var(--rounded-btn)'
			},
			borderWidth: {
				box: 'var(--border-box)',
				btn: 'var(--border-btn)'
			},
			transitionDuration: {
				btn: 'var(--animation-btn)'
			},
			scale: {
				'btn-focus': 'var(--btn-focus-scale)'
			}
		}
	},
	plugins: []
};
