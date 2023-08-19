import React from "react";
import { useSelector } from 'react-redux';
import { __ } from "@wordpress/i18n";
import LFontVariation from '../../preview/LFontVariation';
import {getLocalFontStyle} from '../../../../../common/GlobalFunctions';

const EditLocalPreviewItem = (fontId) => {
	const editFont = useSelector( ( state ) => state.editFont );

	if ( undefined === editFont || null === editFont ) {
		return;
	}

	if ( ! editFont.variations.length || '' === editFont.font_name ) {
		return;
	}

	const variations = editFont.variations;
	const fontName = editFont.font_name;

	return (
		<div className="local-fonts-preview-wrapper">
			<style id={`bcf-local-font-css`}> {getLocalFontStyle(fontName, variations)} </style>
			{
				variations && variations.map( ( variation ) => (
					<LFontVariation font={fontName} weight={variation.font_weight} fontUrl={variation.font_url} style={ '' === variation.font_style ? 'normal' : variation.font_style } key={parseInt(variation.font_weight)+1000} />
				))
			}
		</div>
	);
};

export default EditLocalPreviewItem;
