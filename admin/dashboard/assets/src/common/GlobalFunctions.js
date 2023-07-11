import React from "react";
import { __ } from "@wordpress/i18n";

function getFontWeightTitle( weight, type = '', style = '' ) {

    if ( undefined === weight ) {
        weight = '400';
    }

    let updatedWeight = weight,
        oldWeight = ( 'google' === type ) ? weight : style;
    if ( 'italic' === weight ) {
        oldWeight = '400italic';
    }

    if ( oldWeight.includes('italic') ) {
        updatedWeight = `${oldWeight.replace('italic', '')} Italic`;
    }

    if ( 'italic' === style || 'oblique' === style ) {
        if ( 'italic' === style ) {
            updatedWeight = `${updatedWeight} Italic`;
        } else {
            updatedWeight = `${updatedWeight} Oblique`;
        }
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

function getLocalFontStyle(fontName, variations) {
    console.log(fontName)
    console.log(variations)
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

export {getFontWeightTitle, getLocalFontStyle};
