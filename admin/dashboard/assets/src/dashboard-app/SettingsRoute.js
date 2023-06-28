import React from 'react';
import { useLocation } from 'react-router-dom';
import Welcome from '@DashboardApp/pages/welcome/Welcome';
import AddFont from '@DashboardApp/pages/fonts/AddFont';

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
		bcfWpMenuClassChange( path );
	}

	return <>{ routePage }</>;
}

export default SettingsRoute;
