import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { __ } from "@wordpress/i18n";
import Custom_Fonts_Icons from "@Common/svg-icons";

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
					{(!isInGoogleState) &&
						<button className="flex items-center components-button is-secondary" data-font_weight={weight} onClick={addWeight}>
							{Custom_Fonts_Icons['add']}
							<span className="ml-2" data-font_weight={weight}>{__('Add', 'custom-fonts')}</span>
						</button>
					}
					{ isInGoogleState &&
						<button className="flex text-danger items-center components-button is-secondary border border-danger" data-font_weight={weight} onClick={removeWeight}>
							{Custom_Fonts_Icons['remove']}
							<span className="ml-2" data-font_weight={weight}>{__('Remove', 'custom-fonts')}</span>
						</button>
					}
				</div>
			</div>
		</div>
	);
};

export default GFontVariation;
