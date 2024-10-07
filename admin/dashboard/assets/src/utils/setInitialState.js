import apiFetch from '@wordpress/api-fetch';

const setInitialState = ( store ) => {
	apiFetch( {
		path: '/bsf-custom-fonts/v1/admin/settings/',
	} ).then( ( data ) => {
		const initialState = {
			initialStateSetFlag : true,
			fonts: data.fonts,
			found_posts : data.found_posts,
			active_fonts_count : data.active_fonts_count,
			trash_fonts_count : data.trash_fonts_count,
			draft_fonts_count : data.draft_fonts_count,
			isDbUpdateRequired: false,
			optionPreload: data.optionPreload,
			editType: ''
		};

		store.dispatch( {type: 'UPDATE_INITIAL_STATE', payload: initialState} );
	} )
	.catch((error) => {
		console.error('Error fetching data:', error);
		store.dispatch({
			type: 'FETCH_SETTINGS_FAILED',
			payload: error.message || 'Failed to fetch settings. Please try again.',
		});
	});
};

export default setInitialState;
