// When the route changes, we need to update wp-admin's menu with the correct submenu & menu link.
window.bcfWpMenuClassChange = function ( path ) {
	document.querySelector( 'body' ).classList.remove( 'bcf-add-new-font-page' );
	if ( 'add-fonts' === path ) {
		document.querySelector( 'body' ).classList.add( 'bcf-add-new-font-page' );
	}
};
