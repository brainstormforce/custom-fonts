import React from "react";
import { __ } from "@wordpress/i18n";

const LFontVariation = (props) => {
	const { weight, font, fontUrl, style } = props;

	if ( '' === fontUrl ) {
		return;
	}

	const getFontWeightTitle = ( weight ) => {
		let updatedWeight = weight,
			oldWeight = weight;
		if ( oldWeight.includes('italic') ) {
			updatedWeight = `${oldWeight.replace('italic', '')} Italic`;
		}
		switch ( weight ) {
			case '100':
				return __( 'Thin ', 'custom-fonts' ) + updatedWeight;
			case '200':
				return __( 'Extra Light ', 'custom-fonts' ) + updatedWeight;
			case '300':
				return __( 'Light ', 'custom-fonts' ) + updatedWeight;
			case '400':
				return __( 'Regular ', 'custom-fonts' ) + updatedWeight;
			case '500':
				return __( 'Medium ', 'custom-fonts' ) + updatedWeight;
			case '600':
				return __( 'Semi Bold ', 'custom-fonts' ) + updatedWeight;
			case '700':
				return __( 'Bold ', 'custom-fonts' ) + updatedWeight;
			case '800':
				return __( 'Extra Bold ', 'custom-fonts' ) + updatedWeight;
			case '900':
				return __( 'Black ', 'custom-fonts' ) + updatedWeight;
			default:
				return __( 'Weight ', 'custom-fonts' ) + updatedWeight;
		}
	}

	return (
		<div className="py-5">
			<div>
				<div className="text-sm text-neutral mb-3.5"> { getFontWeightTitle(weight) } </div>
				<div className="text-5xl" style={{ fontFamily: font, fontWeight: weight, fontStyle: style, fontSize: "var(--bsf-custom-font-size)" }}>
					{__('How vexingly quick daft zebras jump!', 'custom-fonts')}
				</div>
			</div>
		</div>
	);
};

export default LFontVariation;
