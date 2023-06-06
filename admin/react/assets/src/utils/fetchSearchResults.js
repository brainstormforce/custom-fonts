import apiFetch from '@wordpress/api-fetch';

const fetchSearchResults = ( query ) => {
	apiFetch( {
		path: `/bsf-custom-fonts/v1/search?q=${query}`,
	} ).then( ( data ) => {
        console.log("Search Result Data", data);
        return data;
	} );
};

export default fetchSearchResults;
