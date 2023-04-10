import React from 'react';
import { useLocation } from 'react-router-dom';
import Welcome from '@DashboardApp/pages/welcome/Welcome';
import AddFont from '@DashboardApp/pages/fonts/AddFont';
// import FreeVsPro from '@DashboardApp/pages/free-vs-pro/FreeVsPro';
// import Settings from '@DashboardApp/pages/settings/Settings';
// import StarterTemplates from '@DashboardApp/pages/starter-templates/StarterTemplates';
// import CustomLayouts from '@DashboardApp/pages/custom-layouts/CustomLayouts';
// import SpectraScreen from '@DashboardApp/pages/spectra/SpectraScreen';
// import Docs from '@DashboardApp/pages/docs/Docs';

function SettingsRoute() {
	const query = new URLSearchParams( useLocation().search );
	const page = query.get( 'page' );
	const path = query.get( 'path' );
	const currentEvent = query.get( 'event' );

	let routePage = <p> Fallback Route Page </p>;

	if ( bsf_custom_fonts_admin.home_slug === page ) {
		if ( 'getting-started' === currentEvent ) {
			routePage = <Welcome />;
		} else {
			switch ( path ) {
				case 'add-fonts':
					routePage = <AddFont />;
					break;
				default:
					routePage = <Welcome />;
					break;
			}
		}

		//astWpMenuClassChange( path );
	}

	return <>{ routePage }</>;
}

export default SettingsRoute;
