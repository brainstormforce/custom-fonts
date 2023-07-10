const getFontWeightTitle = ( weight ) => {
	if ( undefined === weight ) {
		weight = '400';
	}
	let updatedWeight = weight,
		oldWeight = weight;
	if ( 'italic' === weight ) {
		oldWeight = '400italic';
	}
	if ( oldWeight.includes('italic') ) {
		updatedWeight = `${oldWeight.replace('italic', '')} Italic`;
	}
	switch ( weight ) {
		case '100':
		case '100italic':
			return __( 'Thin ', 'custom-fonts' ) + updatedWeight;
		case '200':
		case '200italic':
			return __( 'Extra Light ', 'custom-fonts' ) + updatedWeight;
		case '300':
		case '300italic':
			return __( 'Light ', 'custom-fonts' ) + updatedWeight;
		case '400':
		case '400italic':
			return __( 'Regular ', 'custom-fonts' ) + updatedWeight;
		case '500':
		case '500italic':
			return __( 'Medium ', 'custom-fonts' ) + updatedWeight;
		case '600':
		case '600italic':
			return __( 'Semi Bold ', 'custom-fonts' ) + updatedWeight;
		case '700':
		case '700italic':
			return __( 'Bold ', 'custom-fonts' ) + updatedWeight;
		case '800':
		case '800italic':
			return __( 'Extra Bold ', 'custom-fonts' ) + updatedWeight;
		case '900':
		case '900italic':
			return __( 'Ultra-Bold ', 'custom-fonts' ) + updatedWeight;
		default:
			return updatedWeight;
	}
}
console.log("ye2");


export default getFontWeightTitle;