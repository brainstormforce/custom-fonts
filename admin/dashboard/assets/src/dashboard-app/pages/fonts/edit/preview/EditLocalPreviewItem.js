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

	const getSrcFormat = ( fontUrl ) => {
		let format = '';
		if (fontUrl.includes('.woff2')) {
			format = 'format(\'woff2\')';
		} else if (fontUrl.includes('.woff')) {
			format = 'format(\'woff\')';
		} else if (fontUrl.includes('.svg')) {
			format = 'format(\'svg\')';
		} else if (fontUrl.includes('.ttf')) {
			format = 'format(\'truetype\')';
		} else if (fontUrl.includes('.otf')) {
			format = 'format(\'OpenType\')';
		} else if (fontUrl.includes('.eot')) {
			format = 'url(\'' + fontUrl + '?#iefix\') format(\'embedded-opentype\')';
		} else {
			// Do nothing.
		}
		return format;
	}

	const getLocalFontStyle = () => {
		let defaultFont = `@font-face {\r\n\tfont-family: '${fontName}';`;
		let srcFont = '';

		variations.map((variation) => {
			let fontUrl = variation.font_url,
				weight = variation.font_weight,
				style = '' === variation.font_style ? 'normal' : variation.font_style,
				src = '';
			if ( Array.isArray( fontUrl ) ) {
				fontUrl.map((url, index) => {
					src += ' url(\'' + url + '\') ';
					src += getSrcFormat( url );
					if ( index !== fontUrl.length - 1 ) {
						src += ','; // Add comma if not last item.
					}
				});
			} else {
				src += 'url(\'' + fontUrl + '\') ';
				src += getSrcFormat( fontUrl );
			}
			srcFont += `${defaultFont}\r\n\tfont-style: ${style};\r\n\tfont-weight: ${weight};\r\n\tsrc: ${src};\r\n}\r\n`;
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
