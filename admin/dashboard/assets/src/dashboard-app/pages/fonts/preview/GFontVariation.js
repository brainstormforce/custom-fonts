import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { __ } from "@wordpress/i18n";

const GFontVariation = (props) => {
	const { weight, font, isInGoogleState } = props;
	const googleFont = useSelector( ( state ) => state.googleFont );
	const dispatch = useDispatch();

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

	const addWeight = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const varWt = e.target.dataset.font_weight;
		const variations = googleFont.variations;
		if ( undefined === varWt ) {
			return;
		}
		let style = varWt.includes('italic') ? 'italic' : 'normal';
		variations.push( {
			id: variations.length+1,
			font_file: '',
			font_style: style,
			font_weight: varWt
		} );
		dispatch( { type: 'SET_GOOGLE_FONT', payload: {
			"font_name": googleFont.font_name,
			"font_fallback": googleFont.font_fallback,
			"font_display": googleFont.font_display,
			"variations": variations
		} } );
	}

	const removeWeight = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const updatedVariations = googleFont.variations.filter(
			(variation) => variation.font_weight !== weight
		);

		dispatch( { type: 'SET_GOOGLE_FONT', payload: {
			"font_name": googleFont.font_name ? googleFont.font_name : '',
			"font_fallback": googleFont.font_fallback ? googleFont.font_fallback : '',
			"font_display": googleFont.font_display ? googleFont.font_display : '',
			"variations": updatedVariations
		} } );
	}

	const getRenderFontWeight = (weight) => {
		if ( undefined === weight ) {
			weight = '400';
		}
		if ( weight.includes('italic') ) {
			return weight.replace( "italic", "" );
		}
		return weight;
	}

	const getFontStyle = (weight) => {
		if ( undefined === weight ) {
			weight = '400';
		}
		if ( weight.includes('italic') ) {
			return 'italic';
		} else {
			return 'normal';
		}
	}

	return (
		<div className="py-5">
			<div className="flex justify-between items-center">
				<div>
					{/* Variation Name */}
					<div className="text-sm font-normal text-neutral mb-3.5">
						{ getFontWeightTitle(weight) }
					</div>
					{/* Variation Preview */}
					<div className="text-5xl" style={{ fontFamily: font, fontWeight: getRenderFontWeight(weight), fontStyle:getFontStyle(weight), fontSize: "var(--bsf-custom-font-size)" }}>
						{__('How vexingly quick daft zebras jump!', 'custom-fonts')}
					</div>
				</div>
				<div>
					{ ( ! isInGoogleState ) &&
						<button className="flex items-center components-button is-secondary" data-font_weight={weight} onClick={addWeight}>
							<svg
								width="16"
								height="17"
								viewBox="0 0 16 17"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								data-font_weight={weight}
							>
								<path
									d="M8.00078 1.30005C4.00078 1.30005 0.800781 4.50005 0.800781 8.50005C0.800781 12.5 4.00078 15.7 8.00078 15.7C12.0008 15.7 15.2008 12.5 15.2008 8.50005C15.2008 4.50005 12.0008 1.30005 8.00078 1.30005ZM8.00078 14.1C4.88078 14.1 2.40078 11.62 2.40078 8.50005C2.40078 5.38005 4.88078 2.90005 8.00078 2.90005C11.1208 2.90005 13.6008 5.38005 13.6008 8.50005C13.6008 11.62 11.1208 14.1 8.00078 14.1ZM8.80078 5.30005H7.20078V7.70005H4.80078V9.30005H7.20078V11.7H8.80078V9.30005H11.2008V7.70005H8.80078V5.30005Z"
									fill="#007CBA"
								/>
							</svg>
							<span className="ml-2" data-font_weight={weight}>{__('Add', 'custom-fonts')}</span>
						</button>
					}
					{ isInGoogleState &&
						<button className="flex text-danger items-center components-button is-secondary border border-danger" data-font_weight={weight} onClick={removeWeight}>
							<svg
								width="16"
								height="17"
								viewBox="0 0 16 17"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								data-font_weight={weight}
							>
								<path
									d="M8.00078 1.30005C4.00078 1.30005 0.800781 4.50005 0.800781 8.50005C0.800781 12.5 4.00078 15.7 8.00078 15.7C12.0008 15.7 15.2008 12.5 15.2008 8.50005C15.2008 4.50005 12.0008 1.30005 8.00078 1.30005ZM8.00078 14.1C4.88078 14.1 2.40078 11.62 2.40078 8.50005C2.40078 5.38005 4.88078 2.90005 8.00078 2.90005C11.1208 2.90005 13.6008 5.38005 13.6008 8.50005C13.6008 11.62 11.1208 14.1 8.00078 14.1ZM4.80078 7.70005V9.30005H11.2008V7.70005H4.80078Z"
									fill="rgb(230 80 84 / 1)"
								/>
							</svg>

							<span className="ml-2" data-font_weight={weight}>{__('Remove', 'custom-fonts')}</span>
						</button>
					}
				</div>
			</div>
		</div>
	);
};

export default GFontVariation;
