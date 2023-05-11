import React from "react";
import { __ } from "@wordpress/i18n";

const LFontVariation = (props) => {
	const { weight, font } = props;

	const getFontWeightTitle = ( weight ) => {
		switch ( weight ) {
			case '100':
				return __( 'Thin ', 'custom-fonts' ) + weight;
			case '200':
				return __( 'Extra Light ', 'custom-fonts' ) + weight;
			case '300':
				return __( 'Light ', 'custom-fonts' ) + weight;
			case '400':
				return __( 'Regular ', 'custom-fonts' ) + weight;
			case '500':
				return __( 'Medium ', 'custom-fonts' ) + weight;
			case '600':
				return __( 'Semi Bold ', 'custom-fonts' ) + weight;
			case '700':
				return __( 'Bold ', 'custom-fonts' ) + weight;
			case '800':
				return __( 'Extra Bold ', 'custom-fonts' ) + weight;
			case '900':
				return __( 'Black ', 'custom-fonts' ) + weight;
			default:
				return __( 'Weight ', 'custom-fonts' ) + weight;
		}
	}

	return (
		<div className="py-5">
			<div>
				<div className="text-sm text-neutral mb-3.5"> { getFontWeightTitle(weight) } </div>
				<div className="text-5xl" style={{ fontFamily: font, fontWeight: weight, fontSize: "var(--bsf-custom-font-size)" }}>
					{__('How vexingly quick daft zebras jump!', 'custom-fonts')}
				</div>
			</div>
		</div>
	);
};

export default LFontVariation;
