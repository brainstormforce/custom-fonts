import React from "react";
import { useSelector } from 'react-redux';
import { __ } from "@wordpress/i18n";
import LFontVariation from './LFontVariation';
import {getLocalFontStyle} from '../../../../common/GlobalFunctions';

const LocalPreviewItem = () => {
	const localFont = useSelector( ( state ) => state.localFont );

	if ( undefined === localFont || null === localFont ) {
		return;
	}

	if ( ! localFont.variations.length || '' === localFont.font_name ) {
		return;
	}

	const variations = localFont.variations;
	const fontName = localFont.font_name;

	const getPreviewTitleToggleCSS = () => {
		let previewNameToggleCSS = `.preview-font-name {display: none;}`,
			varsLength = variations.length,
			counter = 0;

		variations.map((variation) => {
			if ( '' === variation.font_url ) {
				counter = counter + 1;
			}
		});

		if ( varsLength === counter ) {
			previewNameToggleCSS = `.preview-font-name {display: block;}`;
		}

		return previewNameToggleCSS;
	}

	return (
		<div className="local-fonts-preview-wrapper">
			<style id={`bcf-local-font-css`}> {`${getLocalFontStyle(fontName, variations)} ${getPreviewTitleToggleCSS()}` } </style>
			{
				variations && variations.map( ( variation ) => (
					<LFontVariation font={fontName} weight={variation.font_weight} fontUrl={variation.font_url} style={ '' === variation.font_style ? 'normal' : variation.font_style } key={parseInt(variation.font_weight)+1000} />
				))
			}
		</div>
	);
};

export default LocalPreviewItem;
