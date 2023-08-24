import React from "react";
import { __ } from "@wordpress/i18n";
import { useSelector } from 'react-redux';
import GFontVariation from './GFontVariation';

const GooglePreviewItem = () => {
	const googleFontState = useSelector( ( state ) => state.googleFont );
	const isDbUpdateRequired = useSelector( ( state ) => state.isDbUpdateRequired);

	if ( undefined === googleFontState ) {
		return;
	}

	const googleFont = googleFontState.font_name;
	const gFontData = bsf_custom_fonts_admin.googleFonts[googleFont];
	if ( undefined === gFontData ) {
		return;
	}
	const variations = gFontData[0] ? gFontData[0] : [];

	const getGoogleFontLink = (font, weight, version) => {
		const fontName = font.replace( / /g, "+" );
		// valid URL - https://fonts.googleapis.com/css?family=Poppins:100,800&display=fallback&ver=4.1.5
		return `${bsf_custom_fonts_admin.googleFontAPI}=${fontName}:${weight}&display=fallback&ver=${version+1}`;
	}

	const checkWeightPresentInState = (weight) => {
		if ( ! googleFontState.variations.length ) {
			return false;
		}

		const new_obs = [];
		Object.keys( googleFontState.variations ).map( ( index ) => {
			new_obs.push( googleFontState.variations[index].font_weight );
		})

		if ( new_obs.includes(weight) ) {
			return true;
		}

		return false;
	}

	return (
		variations && Object.keys( variations ).map( ( key, i ) => (
			<div key={i} className="google-fonts-preview-wrapper">
				<style id={`bcf-google-font-${i}-css`}> {'.preview-font-name {display: none;}'} </style>
				<link rel='stylesheet' id={`bcf-google-font-${i}-link`} href={getGoogleFontLink(googleFont, variations[key], i)} media='all' />
				<GFontVariation disable={isDbUpdateRequired} font={googleFont} weight={variations[key]} isInGoogleState={checkWeightPresentInState(variations[key])} key={key} />
			</div>
		))
	);
};

export default GooglePreviewItem;
