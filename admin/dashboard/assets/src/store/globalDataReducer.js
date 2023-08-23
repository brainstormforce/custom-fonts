const globalDataReducer = ( state = {}, action ) => {
	let actionType = wp.hooks.applyFilters( 'custom_fonts_dashboard/data_reducer_action', action.type );
	switch ( actionType ) {
		case 'UPDATE_INITIAL_STATE':
			return {
				...action.payload,
			};
		case 'UPDATE_INITIAL_STATE_FLAG':
			return {
				...state,
				initialStateSetFlag: action.payload,
			};
		case 'SET_FONTS':
			return {
				...state,
				fonts: [ ...action.fonts ],
			};
		case 'SET_LOCAL_FONT' :
			return {
				...state,
				localFont: action.payload,
			};
		case 'SET_EDIT_FONT' :
			return {
				...state,
				editFont: action.payload,
			};
		case 'SET_GOOGLE_FONT':
			if ( ! ( 'googleFont' in state ) || ( 'googleFont' in state && state.googleFont.font_name !== action.payload.font_name ) ) {
				return {
					...state,
					googleFont: {
						"font_name": action.payload.font_name,
						"font_fallback": '',
						"font_display": '',
						"variations": []
					},
				};
			} else {
				return {
					...state,
					googleFont: {
						"font_name": action.payload.font_name,
						"font_fallback": action.payload.font_fallback ? action.payload.font_fallback : '',
						"font_display": action.payload.font_display ? action.payload.font_display : 'fallback',
						"variations": action.payload.variations ? action.payload.variations : []
					},
				};
			}
		case 'SET_FONTS_DATA':
			return {
				...state,
				fonts: [ ...action.fonts ],
				fonts_pagination: action.pagination,
				found_posts: action.found_posts,
				active_fonts_count: action.active_fonts_count,
				trash_fonts_count: action.trash_fonts_count,
				draft_fonts_count: action.draft_fonts_count,
				fonts_count: action.found_posts,
				fonts_limit_over: false, // Removed the font count condition
			};
		case 'UPDATE_SETTINGS_SAVED_NOTIFICATION':
			return {
				...state,
				settingsSavedNotification: action.payload,
			};
		case 'UPDATE_PRELOADING':
			return {
				...state,
				optionPreload: action.payload,
			};
		case 'IS_DB_UPDATE_REQUIRED':
			return {
				...state,
				isDbUpdateRequired: action.payload.isDbUpdateRequired,
				editType: action.payload.editType === '' ? state.editType : action.payload.editType
			};
		default:
			return state;
	}
}

export default globalDataReducer;
