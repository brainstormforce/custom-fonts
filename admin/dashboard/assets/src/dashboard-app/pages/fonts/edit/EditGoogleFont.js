import React, { useState } from "react";
import { __ } from "@wordpress/i18n";
import apiFetch from '@wordpress/api-fetch';
import { useSelector } from 'react-redux';
import Custom_Fonts_Icons from "@Common/svg-icons";

const EditGoogleVariationItem = ({
	id,
	variation
}) => {
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
			updatedWeight = `${oldWeight.replace('italic', '')} ` + __( 'Italic', 'custom-fonts' );
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

	return (
		<div key={id} className={`text-sm font-normal text-heading mt-3.5 edit-gfont-variation-item`} data-varweight={variation}>
			{
				getFontWeightTitle(variation)
			}
		</div>
	);
};

const EditGoogleFont = ({fontId, fontName}) => {
	const restAllData = useSelector( ( state ) => state.fonts );
	const editFontId = parseInt( fontId );

	let toBeEditFont = {};
	let variations = null;
	restAllData.forEach(function(individualFont) {
		if ( editFontId === individualFont.id && undefined !== bsf_custom_fonts_admin.googleFonts[individualFont.title] ) {
			const gFontData = bsf_custom_fonts_admin.googleFonts[individualFont.title];
			variations = gFontData[0] ? gFontData[0] : [];
			toBeEditFont = individualFont;
		}
	});

	let editingFontData = {};
	if ( undefined === toBeEditFont['fonts-data'] || ! toBeEditFont['fonts-data'].length ) {
		editingFontData = toBeEditFont['fonts-data'];
	}

	const [ isLoading, setLoading ] = useState( false );

	const updatingNewFontPost = ( e ) => {
		e.preventDefault();

		setLoading( 'loading' );
		const formData = new window.FormData();
		const editFontStringifiedData = document.getElementById('gfont-edit-variation-data').innerHTML;

		formData.append( 'action', 'bcf_edit_font' );
		formData.append( 'security', bsf_custom_fonts_admin.edit_font_nonce );
		formData.append( 'font_type', 'google' );
		formData.append( 'font_id', fontId );
		formData.append( 'font_data', editFontStringifiedData );

		apiFetch( {
			url: bsf_custom_fonts_admin.ajax_url,
			method: 'POST',
			body: formData,
		} ).then( (response) => {
			if ( response.success ) {
				setTimeout( () => {
					window.location = `${ bsf_custom_fonts_admin.app_base_url }`;
				}, 500 );
			}
			setLoading( false );
		} );
	};

	let variationCount = 0;

	return (
		<div>
			<div>
				<p className="mb-5 text-xl font-semibold">
					{__( 'Edit Font', 'custom-fonts' )}
				</p>

				<div className="geditfontwrapper">
					<div className="my-5 border border-light rounded-sm p-3.5">
						<h3 className="text-base font-semibold text-heading">
							{__('Selected Variant', 'custom-fonts')}
						</h3>
						<div className="flex flex-col gap-y-3.5">
							<div className="gvariations-wrapper">
								{variations.map((variation) => (
									<EditGoogleVariationItem
										key={variation}
										variation={variation}
									/>
								))}
							</div>
						</div>
					</div>

					<div className="my-5">
						<button
							type="button"
							className="bcf-save-font inline-flex components-button is-primary mb-5"
							onClick={ updatingNewFontPost }
							disabled={'loading' === isLoading ? true : false}
						>
							{__( 'Save Font', 'custom-fonts' )}
							{ 'loading' === isLoading && Custom_Fonts_Icons['saveFont']}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditGoogleFont;
