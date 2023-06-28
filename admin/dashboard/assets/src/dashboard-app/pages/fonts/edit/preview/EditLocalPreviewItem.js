import React from "react";
import { useSelector } from 'react-redux';
import { __ } from "@wordpress/i18n";
import LFontVariation from '../../preview/LFontVariation';

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

	const getLocalFontStyle = () => {
		let defaultFont = `@font-face {\r\n\tfont-family: '${fontName}';\r\n\tfont-style: normal;`;
		let srcFont = '';

		variations.map((variation) => {
			let fontUrl = variation.font_url,
				weight = variation.font_weight,
				src = 'url(\'' + fontUrl + '\') ';
			if (fontUrl.includes('.woff2')) {
				src += 'format(\'woff2\')';
			} else if (fontUrl.includes('.woff')) {
				src += 'format(\'woff\')';
			} else if (fontUrl.includes('.svg')) {
				src += 'format(\'svg\')';
			} else if (fontUrl.includes('.ttf')) {
				src += 'format(\'truetype\')';
			} else if (fontUrl.includes('.otf')) {
				src += 'format(\'OpenType\')';
			} else if (fontUrl.includes('.eot')) {
				src = 'url(\'' + fontUrl + '?#iefix\') format(\'embedded-opentype\')';
			} else {
				// Do nothing.
			}
			srcFont += `${defaultFont}\r\n\tfont-weight: ${weight};\r\n\tsrc: ${src};\r\n}\r\n`;
		});

		return srcFont;
	}

	return (
		<div className="local-fonts-preview-wrapper">
			<style id={`bcf-local-font-css`}> {getLocalFontStyle()} </style>
			{
				variations && variations.map( ( variation ) => (
					<LFontVariation font={fontName} weight={variation.font_weight} fontUrl={variation.font_url} style={ '' === variation.font_style ? 'normal' : variation.font_style } key={parseInt(variation.font_weight)+1000} />
				))
			}
		</div>
	);
};

export default EditLocalPreviewItem;
