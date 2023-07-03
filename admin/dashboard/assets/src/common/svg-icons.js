import { createElement as el } from '@wordpress/element';

const Custom_Fonts_Icons = {
	'play': el(
		'svg',
		{ width: 65, height: 64, viewBox: '0 0 65 64', fill: 'none' ,className:"my-0 mx-auto"},
		el( 'rect', {
			x:0.5, rx:32, width: 64, height: 64, fill: 'white',
		} ),
		el( 'path', {
			d: 'M19.5 34H24.6459C25.7822 34 26.821 34.642 27.3292 35.6584L27.6708 36.3416C28.179 37.358 29.2178 38 30.3541 38H34.6459C35.7822 38 36.821 37.358 37.3292 36.3416L37.6708 35.6584C38.179 34.642 39.2178 34 40.3541 34H45.5M19.5 34.4511V40C19.5 41.6569 20.8431 43 22.5 43H42.5C44.1569 43 45.5 41.6569 45.5 40V34.4511C45.5 34.152 45.4553 33.8547 45.3673 33.5688L42.1516 23.1177C41.7643 21.859 40.6013 21 39.2843 21H25.7157C24.3987 21 23.2357 21.859 22.8484 23.1177L19.6327 33.5688C19.5447 33.8547 19.5 34.152 19.5 34.4511Z',
			stroke: '#007CBA',
			strokeWidth: 2,
            strokeLinecap:'round',
             strokeLinejoin:'round',

		} ),

	)  
};

export default Custom_Fonts_Icons;