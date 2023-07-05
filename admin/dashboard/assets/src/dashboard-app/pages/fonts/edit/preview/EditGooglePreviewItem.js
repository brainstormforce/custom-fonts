import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import { useSelector, useDispatch } from 'react-redux';
import Custom_Fonts_Icons from "@Common/svg-icons";

const EditGFontVariation = (
	{
		id,
		weight,
		font,
		isInGoogleState,
		addWeight,
		removeWeight
	}
) => {
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
			return "italic";
		}
		return "normal";
	}

	return (
		<div key={id} className="py-5">
			<div className="flex justify-between items-center">
				<div>
					{/* Variation Name */}
					<div className="text-sm font-normal text-neutral mb-3.5">
						{ getFontWeightTitle(weight) }
					</div>
					{/* Variation Preview */}
					<div className="text-5xl" style={{ fontFamily: font, fontStyle:getFontStyle(weight), fontWeight: getRenderFontWeight(weight), fontSize: "var(--bsf-custom-font-size)" }}>
						{__('How vexingly quick daft zebras jump!', 'custom-fonts')}
					</div>
				</div>
				<div>
					{ ( ! isInGoogleState ) &&
						<button className="flex items-center components-button is-secondary" data-font_weight={weight} onClick={addWeight}>
							{Custom_Fonts_Icons['add']}
							<span className="ml-2" data-font_weight={weight}>{__('Add', 'custom-fonts')}</span>
						</button>
					}
					{isInGoogleState &&
						<button className="flex text-danger components-button is-secondary border border-danger" data-font_weight={weight} onClick={removeWeight}>
							{Custom_Fonts_Icons['remove']}
							<span className="ml-2" data-font_weight={weight}>{__('Remove', 'custom-fonts')}</span>
						</button>
					}
				</div>
			</div>
		</div>
	);
};

const EditGooglePreviewItem = ( { fontId, fontName } ) => {
	const dispatch = useDispatch();
	const editFontId = parseInt( fontId );

	let editingFontData = null;
	const [variationToggleStyle, setVariationToggleStyle] = useState('');

	const restAllData = useSelector( ( state ) => state.fonts );

	let toBeEditFont = {};
	let variations = null;
	restAllData.forEach(function(individualFont) {
		if ( editFontId === individualFont.id && undefined !== bsf_custom_fonts_admin.googleFonts[individualFont.title] ) {
			const gFontData = bsf_custom_fonts_admin.googleFonts[individualFont.title];
			variations = gFontData[0] ? gFontData[0] : [];
			toBeEditFont = individualFont;
		}
	});

	if ( undefined === toBeEditFont['fonts-data'] || ! toBeEditFont['fonts-data'].length ) {
		editingFontData = toBeEditFont['fonts-data'];
	}

	const [editFontData, setEditGoogleFontData] = useState( editingFontData );
	if ( null === variations ) {
		return;
	}

	useEffect( () => {
		let newStyle = '';
		Object.keys( editFontData.variations ).map( ( index ) => {
			const variationWeight = (editFontData.variations[index].font_weight).toString();
			newStyle += `.gvariations-wrapper > [data-varweight='${variationWeight}'] { display: block }`;
		});
		setVariationToggleStyle( newStyle );

		document.getElementById('gfont-edit-variation-data').innerHTML = "";
		document.getElementById('gfont-edit-variation-data').innerHTML = JSON.stringify( editFontData );

		dispatch( { type: 'SET_EDIT_FONT', payload: editFontData } );
	}, [editFontData] );

	const getGoogleFontLink = (font, weight, version) => {
		const fontName = font.replace( / /g, "+" );
		// valid URL - https://fonts.googleapis.com/css?family=Poppins:100,800&display=fallback&ver=4.1.5
		return `${bsf_custom_fonts_admin.googleFontAPI}=${fontName}:${weight}&display=fallback&ver=${version+1}`;
	}

	const addWeight = (e) => {
		const varWt = (e.target.dataset.font_weight).toString();

		const variations = editFontData.variations;
		if ( undefined === varWt ) {
			return;
		}
		let style = varWt.includes('italic') ? 'italic' : 'normal';
		variations.push( {
			id: (variations.length+1).toString(),
			font_file: '',
			font_style: style,
			font_weight: varWt
		} );

		setEditGoogleFontData({
			...editFontData,
			variations: variations,
		});
	}

	const removeWeight = (e) => {
		const varWt = (e.target.dataset.font_weight).toString();

		const newVariation = editFontData.variations.filter(
			(variation) => variation.font_weight != varWt
		);

		setEditGoogleFontData({
			...editFontData,
			variations: newVariation,
		});
	}

	const checkWeightPresentInState = (weight) => {
		if ( ! editFontData.variations.length ) {
			return false;
		}

		const new_obs = [];
		Object.keys( editFontData.variations ).map( ( index ) => {
			new_obs.push( editFontData.variations[index].font_weight );
		})

		if ( new_obs.includes(weight) ) {
			return true;
		}

		return false;
	}

	return (
		variations && Object.keys( variations ).map( ( key, i ) => (
			<div key={i}>
				<style id={`bcf-gfont-${editFontData.font_name}-variation-css`}> {variationToggleStyle} </style>
				<link rel='stylesheet' id={`bcf-google-font-${i}-link`} href={getGoogleFontLink(editFontData.font_name, variations[key], i)} media='all' />
				<EditGFontVariation
					key={i}
					weight={variations[key]}
					font={editFontData.font_name}
					isInGoogleState={checkWeightPresentInState(variations[key])}
					addWeight={addWeight}
					removeWeight={removeWeight}
				/>
			</div>
		) )
	);
}

export default EditGooglePreviewItem;
