import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from 'react-redux';
import { __ } from "@wordpress/i18n";
import { useSelector } from 'react-redux';
import apiFetch from '@wordpress/api-fetch';
import { editFontToDB, deleteFontFromDB, addFontToDB } from "../../../utils/useApis";

const GoogleVariationItem = ({
	id,
	variation,
	handleVariationRemove,
	disable
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

	const doNothing = () => {};

	return (
		<div key={id} className="flex items-center justify-between">
			<div className="text-sm font-normal text-heading">
				{
					getFontWeightTitle(variation.font_weight)
				}
			</div>
			<div>
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					onClick={() =>
						disable ? doNothing() : handleVariationRemove(variation.id)
					}
				>
					<path
						d="M8.00078 0.800049C4.00078 0.800049 0.800781 4.00005 0.800781 8.00005C0.800781 12 4.00078 15.2 8.00078 15.2C12.0008 15.2 15.2008 12 15.2008 8.00005C15.2008 4.00005 12.0008 0.800049 8.00078 0.800049ZM8.00078 13.6C4.88078 13.6 2.40078 11.12 2.40078 8.00005C2.40078 4.88005 4.88078 2.40005 8.00078 2.40005C11.1208 2.40005 13.6008 4.88005 13.6008 8.00005C13.6008 11.12 11.1208 13.6 8.00078 13.6ZM4.80078 7.20005V8.80005H11.2008V7.20005H4.80078Z"
						fill="rgb(230 80 84 / 1)"
					/>
				</svg>
			</div>
		</div>
	);
};

const GoogleFont = () => {
	const googleFontData = useSelector( ( state ) => state.googleFont );
	const isDbUpdateRequired = useSelector( ( state ) => state.isDbUpdateRequired);
	const fontsData = useSelector((state) => state.fonts);

	const googleFonts = bsf_custom_fonts_admin.googleFonts;
	const dispatch = useDispatch();
	const [gFont, setGFont] = useState('');
	const [ addingFont, setAddingFont ] = useState( false );
	const [fontId, setFontId] = useState(null);

	useEffect(() =>{
		if(isDbUpdateRequired && googleFontData){
			if(fontId) googleFontData.variations.length !== 0 ? editFontToDB(dispatch, fontId, googleFontData) : deleteFontFromDB(dispatch, fontId);
			else googleFontData.variations.length === 1 ? addFontToDB(dispatch, googleFontData, (fId) => {setFontId(fId)}): null;
		}
		
	}, [isDbUpdateRequired])

	function handleGoogleFontChange( e ) {
		setGFont( e.target.value );
		setFontId(null);

		const changeEvent = new CustomEvent( 'bcf:googleFontSelection:change', {
			bubbles: true,
			detail: { e, name: e.target.name, value: e.target.value },
		} );

		document.dispatchEvent( changeEvent );
		dispatch( { type: 'SET_GOOGLE_FONT', payload: {
			"font_name": e.target.value,
			"font_fallback": '',
			"font_display": '',
			"variations": []
		} } );
	}

	const handleVariationRemove = (id) => {
		const updatedVariations = googleFontData.variations.filter(
			(variation) => variation.id !== id
		);

		dispatch( { type: 'SET_GOOGLE_FONT', payload: {
			"font_name": googleFontData.font_name ? googleFontData.font_name : '',
			"font_fallback": googleFontData.font_fallback ? googleFontData.font_fallback : '',
			"font_display": googleFontData.font_display ? googleFontData.font_display : '',
			"variations": updatedVariations
		} } );
		dispatch( { type: 'IS_DB_UPDATE_REQUIRED', isDbUpdateRequired: true } );
	};

	return (
		<div>
			<div>
				<div>
					<label className="w-full text-sm text-heading" htmlFor="">
						{__('Select Font', 'custom-fonts')}
					</label>
					<div className="mt-1.5">
						<select
							className="w-full"
							name="bcf-google-font-selection"
							id="bcf-google-font-selection"
							value={gFont}
							onChange={handleGoogleFontChange}
						>
							<option value=''> {__('Select a font family...', 'custom-fonts')} </option>
							{Object.keys(googleFonts).map((key) => (
								<option value={key} key={key} disabled={ bsf_custom_fonts_admin.existingGoogleFonts.includes( key ) }>{key}</option>
							))}
						</select>
					</div>
				</div>
				{ (googleFontData && googleFontData.variations && googleFontData.variations.length > 0) &&
					<div className="my-5 border border-light rounded-sm p-3.5">
						<h3 className="text-base font-semibold text-heading">
							{__('Selected Variant', 'custom-fonts')}
						</h3>
						<div className="mt-3.5 flex flex-col gap-y-3.5">
							{googleFontData.variations.map((variation) => (
								<GoogleVariationItem
									key={variation.id+1}
									variation={variation}
									handleVariationRemove={handleVariationRemove}
									disable = {isDbUpdateRequired}
								/>
							))}
						</div>
					</div>
				}
			</div>
		</div>
	);
};

export default GoogleFont;
