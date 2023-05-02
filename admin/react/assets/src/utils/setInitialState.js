import apiFetch from '@wordpress/api-fetch';

const setInitialState = ( store ) => {
	apiFetch( {
		path: '/bsf-custom-fonts/v1/admin/settings/',
	} ).then( ( data ) => {
		const initialState = {
			settingsSavedNotification: '',
			initialStateSetFlag : true,
			activeSettingsNavigationTab : 'global-settings',
			useUpgradeNotices: data.use_upgrade_notices,
		};

		store.dispatch( {type: 'UPDATE_INITIAL_STATE', payload: initialState} );
	} );
};

export default setInitialState;
