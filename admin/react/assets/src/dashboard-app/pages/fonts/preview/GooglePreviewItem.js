import React from "react";
import { __ } from "@wordpress/i18n";
import { useSelector } from 'react-redux';
import GFontVariation from './GFontVariation';

const GooglePreviewItem = () => {
	const googleFontState = useSelector( ( state ) => state.googleFont );

	if ( undefined === googleFontState ) {
		return;
	}

	const googleFont = googleFontState.font_name;
	const gFontData = bsf_custom_fonts_admin.googleFonts[googleFont];
	const variations = gFontData[0] ? gFontData[0] : [];

	const getGoogleFontLink = (font, version) => {
		const fontName = font.replace( / /g, "+" );
		return `https://fonts.googleapis.com/css?family=${fontName}&ver=${version+1}`;
	}

	const checkWeightPresentInState = (weight) => {
		if ( ! googleFontState.variations.length ) {
			return false;
		}

		const new_obs = [];
		Object.entries( googleFontState.variations ).map( ( variation ) => {
			console.error( variation );
			new_obs.push( variation.font_weight );
		})

		if ( weight in new_obs ) {
			return true;
		}

		return false;
	}

	return (
		variations && Object.keys( variations ).map( ( key, i ) => (
			<div key={i}>
				<link rel='stylesheet' id={`bcf-google-font-${i}-link`} href={getGoogleFontLink(googleFont, i)} media='all' />
				<GFontVariation font={googleFont} weight={variations[key]} isInGoogleState={checkWeightPresentInState(variations[key])} key={key} />
			</div>
		))
	);
};

export default GooglePreviewItem;
