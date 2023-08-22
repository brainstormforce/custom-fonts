import React, { useEffect, useState } from "react";
import { __ } from "@wordpress/i18n";
import { useSelector } from 'react-redux';
import { Snackbar } from "@wordpress/components";

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

const EditGoogleFont = ({fontId, fontName, fontUpdateAction, setFontUpdateAction}) => {
	const restAllData = useSelector( ( state ) => state.fonts );
	const editFontId = parseInt( fontId );
	const [showMessage, setShowMessage] = useState('');
	const editType = useSelector( ( state ) => state.editType);

	let toBeEditFont = {};
	let variations = [];
	restAllData.forEach(function(individualFont) {
		if ( editFontId === individualFont.id && undefined !== bsf_custom_fonts_admin.googleFonts[individualFont.title] ) {
			const gFontData = bsf_custom_fonts_admin.googleFonts[individualFont.title];
			variations = gFontData[0] ? gFontData[0] : [];
			toBeEditFont = individualFont;
		}
	});

	useEffect( () => {
		setTimeout(() => {
			setFontUpdateAction('');
		}, 3000)
	}, [fontUpdateAction])

	let editingFontData = {};
	if ( undefined === toBeEditFont['fonts-data'] || ! toBeEditFont['fonts-data'].length ) {
		editingFontData = toBeEditFont['fonts-data'];
	}

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
				</div>

				{fontUpdateAction.length > 0 ? <div className={fontUpdateAction === 'edit' && editType === 'add' ? 'snack-bar-added' : 'snack-bar-removed'}>
					<Snackbar>{fontUpdateAction === 'edit' ? editType === 'add' ? __('Variation Added Successfully!', 'custom-fonts') : __('Variation Removed Successfully!', 'custom-fonts') : __('Font Removed Successfully!', 'custom-fonts')}</Snackbar>
				</div> : null}
			</div>
		</div>
	);
};

export default EditGoogleFont;
