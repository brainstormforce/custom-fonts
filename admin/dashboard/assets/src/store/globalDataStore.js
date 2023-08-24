import { createStore } from 'redux';
import globalDataReducer from './globalDataReducer';

const initialState = wp.hooks.applyFilters( 'custom_fonts_dashboard/datastore', {
		initialStateSetFlag : false,
		settingsSavedNotification : '',
		fonts: null,
		googleFont: null,
		localFont: null,
		editFont: null,
		fonts_pagination : {},
		found_posts : '',
		active_fonts_count : '',
		trash_fonts_count : '',
		draft_fonts_count : '',
		fonts_count : '',
		fonts_limit_over : false,
		optionPreload: false,
	}
);

const globalDataStore = createStore(
	globalDataReducer,
	initialState,
	window.__REDUX_DEVTOOLS_EXTENSION__ &&
	window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default globalDataStore;
