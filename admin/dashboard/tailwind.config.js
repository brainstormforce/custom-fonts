module.exports = {
	content: [
		'./assets/src/dashboard-app/**/*.{html,js}',
	],
	plugins: [
		require( '@tailwindcss/forms' ),
	],
	theme: {
		extend: {
			colors: {
				bcf: {
					DEFAULT: '#046BD2',
					hover: '#045CB4',
				},
				primary: '#007CBA',
				primaryDark: '#006BA1',
				heading: '#1D2327',
				secondary: '#3C434A',
				neutral: '#7E7E7E',
				danger: '#E65054',
				light: '#dddddd',
				'theme-bg': '#F6F7F7'
			},
			blur: {
				xs: '3px',
			},
			fontFamily: {
				inter: ['"Inter"', 'sans-serif'],
			},
			boxShadow: {
				'overlay-left': '-16px 0px 80px -24px rgba(0, 0, 0, 0.16)',
				'overlay-right': '16px 0px 80px -24px rgba(0, 0, 0, 0.16)',
				'hover': '0px 12px 24px -12px rgba(0, 0, 0, 0.12)',
				'overlay-light': '0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
				'overlay-modal': '0px 32px 64px -24px rgba(0, 0, 0, 0.24)',
			},
			screens: {
				'tablet': {'max': '782px'},
				// => @media (max-width: 782px) { ... }
				'mobile': {'max': '600px'},
				// => @media (max-width: 600px) { ... }
				'iphone': {'max': '400px'},
				// => @media (max-width: 400px) { ... }
			},
			borderColor: (theme) => ({
				...theme('colors'),
			}),
		},
	},
	variants: {
		extend: {},
	},
}
