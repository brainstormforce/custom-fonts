import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import { useSelector, useDispatch } from 'react-redux';
import { addFontToDB, deleteFontFromDB, editFontToDB } from "../../../../../utils/useApis";
import Custom_Fonts_Icons from "@Common/svg-icons";

const EditGFontVariation = (
	{
		id,
		weight,
		font,
		isInGoogleState,
		addWeight,
		removeWeight,
		disable
	}
) => {

	const [removeTitle, setRemoveTitle] = useState( __( 'Remove', 'custom-fonts' ) );
	const [addTitle, setAddTitle] = useState( __( 'Add', 'custom-fonts' ) );

	useEffect(() => {
		if (!disable) {
		  setRemoveTitle( __( 'Remove', 'custom-fonts' ) );
		  setAddTitle( __( 'Add', 'custom-fonts' ) );
		}
	  }, [disable]);

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
          {!isInGoogleState && (
            <button
              disabled={disable}
              style={
                disable
                  ? addTitle === "Removing..."
                    ? {
                        color: "#3858E9",
                        borderColor: "#3858E9",
                        boxShadow: "inset 0 0 0 1px",
                      }
                    : {
                        color: "grey",
                        borderColor: "grey",
                        boxShadow: "inset 0 0 0 1px",
                      }
                  : { boxShadow: "inset 0 0 0 1px" }
              }
              className={
                addTitle === "Removing..."
									? "flex text-danger items-center components-button is-secondary border border-danger"
									: "flex items-center components-button is-secondary"
							}
							data-font_weight={weight}
							onClick={(e) => { setRemoveTitle( __( 'Adding...', 'custom-fonts' ) ); addWeight(e) }}
						>
							{addTitle === __( 'Removing...', 'custom-fonts' ) ? (Custom_Fonts_Icons['loadingSpinner3']) : (
								<span data-font_weight={weight} style={{ pointerEvents: 'none' }}>
								{Custom_Fonts_Icons['iconsquare']} 
							  </span>
							)}
							<span className="ml-2" data-font_weight={weight}>
								{addTitle}
							</span>
						</button>
					)}
					{isInGoogleState && (
            <button
              disabled={disable}
              style={
                disable
                  ? removeTitle === __( 'Adding...', 'custom-fonts' )
                    ? {
                        color: "#3858E9",
                        borderColor: "#3858E9",
                        boxShadow: "inset 0 0 0 1px",
                      }
                    : {
                        color: "grey",
                        borderColor: "grey",
                        boxShadow: "inset 0 0 0 1px",
										}
									: { boxShadow: "inset 0 0 0 1px" }
							}
							className={
								removeTitle === __( 'Adding...', 'custom-fonts' )
									? "flex items-center components-button is-secondary"
									: "flex text-danger items-center components-button is-secondary border border-danger"
							}
							data-font_weight={weight}
							onClick={(e) => { setAddTitle( __( 'Removing...', 'custom-fonts' ) ); removeWeight(e) }}
						>
							{removeTitle === __( 'Adding...', 'custom-fonts' ) ? (Custom_Fonts_Icons['loadingSpinner3']) : (
								<span data-font_weight={weight} style={{ pointerEvents: 'none' }}>
									{Custom_Fonts_Icons['iconsquare2']}
								</span>
							)}

							<span className="ml-2" data-font_weight={weight}>
								{removeTitle}
							</span>
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

const EditGooglePreviewItem = ( { fontId, fontName, onFontUpdated } ) => {
	const dispatch = useDispatch();
	const editFontId = parseInt( fontId );

	let editingFontData = null;
	const [variationToggleStyle, setVariationToggleStyle] = useState('');

	const restAllData = useSelector( ( state ) => state.fonts );
	const isDbUpdateRequired = useSelector( ( state ) => state.isDbUpdateRequired);

	useEffect(() =>{
		if(isDbUpdateRequired && editFontData){
			if(fontId) editFontData.variations.length !== 0 ? editFontToDB(dispatch, fontId, editFontData, fontUpdated.bind(this, 'edit')) : deleteFontFromDB(dispatch, fontId, fontUpdated.bind(this, 'delete') );
		}

	}, [isDbUpdateRequired])

	const fontUpdated = (action) => {
		if(action === 'delete'){
			dispatch( { type: 'SET_EDIT_FONT', payload: null } );
		}
		onFontUpdated(action);
	}

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
	
	if ( null === variations ) {
		return;
	}

	const getGoogleFontLink = (font, weight, version) => {
		const fontName = font.replace( / /g, "+" );
		// valid URL - https://fonts.googleapis.com/css?family=Poppins:100,800&display=fallback&ver=4.1.5
		return `${bsf_custom_fonts_admin.googleFontAPI}=${fontName}:${weight}&display=fallback&ver=${version+1}`;
	}

	const addWeight = (e) => {
		let varWt;
		if (e.target.dataset.font_weight) {
			varWt = e.target.dataset.font_weight.toString();
		} else {
			return;
		}

		const variations = editFontData.variations;
		let style = varWt.includes('italic') ? 'italic' : 'normal';
		variations.push({
			id: (variations.length + 1).toString(),
			font_file: '',
			font_style: style,
			font_weight: varWt
		});

		setEditGoogleFontData({
			...editFontData,
			variations: variations,
		});
		dispatch({ type: 'IS_DB_UPDATE_REQUIRED', payload: { isDbUpdateRequired: true, editType: 'add' } });
	}

	const removeWeight = (e) => {
		let varWt;
		if (e.target.dataset.font_weight) {
			varWt = e.target.dataset.font_weight.toString();
		} else {
			return;
		}

		const newVariation = editFontData.variations.filter(
			(variation) => variation.font_weight != varWt
		);

		setEditGoogleFontData({
			...editFontData,
			variations: newVariation,
		});
		dispatch({ type: 'IS_DB_UPDATE_REQUIRED', payload: { isDbUpdateRequired: true, editType: 'remove' } });
	}

	const checkWeightPresentInState = (weight) => {
		if (!editFontData.variations.length) {
			return false;
		}

		const new_obs = [];
		Object.keys(editFontData.variations).map((index) => {
			new_obs.push(editFontData.variations[index].font_weight);
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
					disable={isDbUpdateRequired}
				/>
			</div>
		) )
	);
}

export default EditGooglePreviewItem;
