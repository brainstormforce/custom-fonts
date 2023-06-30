import React from "react";
import { __ } from "@wordpress/i18n";

const LFontVariation = (props) => {
	const { weight, font, fontUrl, style } = props;

	if ( '' === fontUrl ) {
		return;
	}

	const getFontWeightTitle = ( weight, style ) => {
		if ( undefined === weight ) {
			weight = '400';
		}
		let updatedWeight = weight,
			oldWeight = weight;
		if ( 'italic' === weight ) {
			oldWeight = '400italic';
		}
		if ( oldWeight.includes('italic') ) {
			updatedWeight = `${oldWeight.replace('italic', '')} ` + __( 'Italic', 'custom-fonts' );
		}
		if ( 'italic' === style || 'oblique' === style ) {
			if ( 'italic' === style ) {
				updatedWeight = `${updatedWeight} Italic`;
			} else {
				updatedWeight = `${updatedWeight} Oblique`;
			}
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

	return (
		<div className="py-5">
			<div>
				<div className="text-sm font-normal text-neutral mb-3.5"> { getFontWeightTitle(weight, style) } </div>
				<div className="text-5xl" style={{ fontFamily: font, fontWeight: weight, fontStyle: style, fontSize: "var(--bsf-custom-font-size)" }}>
					{__('How vexingly quick daft zebras jump!', 'custom-fonts')}
				</div>
			</div>
		</div>
	);
};

export default LFontVariation;
