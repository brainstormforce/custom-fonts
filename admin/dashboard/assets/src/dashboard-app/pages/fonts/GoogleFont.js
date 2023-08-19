import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { __ } from "@wordpress/i18n";
import { useSelector } from 'react-redux';
import apiFetch from '@wordpress/api-fetch';
import Custom_Fonts_Icons from "@Common/svg-icons";

const GoogleVariationItem = ({
	id,
	variation,
	handleVariationRemove
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
		<div key={id} className="flex items-center justify-between">
			<div className="text-sm font-normal text-heading">
				{
					getFontWeightTitle(variation.font_weight)
				}
			</div>
			<div>
				{Custom_Fonts_Icons['removeVariation']}
			</div>

		</div>
	);
};

const GoogleFont = () => {
	const googleFontData = useSelector( ( state ) => state.googleFont );

	const googleFonts = bsf_custom_fonts_admin.googleFonts;
	const dispatch = useDispatch();
	const [gFont, setGFont] = useState('');
	const [ addingFont, setAddingFont ] = useState( false );

	function handleGoogleFontChange( e ) {
		setGFont( e.target.value );

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
	};

	const insertGoogleFontPost = ( e ) => {
		e.preventDefault();

		if ( '' === googleFontData.font_name ) {
			window.alert(
				__( 'Make sure to provide valid details.', 'custom-fonts' )
			);
			return;
		}

		setAddingFont( 'loading' );
		const formData = new window.FormData();

		formData.append( 'action', 'bcf_add_new_google_font' );
		formData.append( 'security', bsf_custom_fonts_admin.add_font_nonce );
		formData.append( 'font_type', 'google' );
		formData.append( 'font_data', JSON.stringify( googleFontData ) );

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
			setAddingFont( false );
		} );
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
								/>
							))}
						</div>
					</div>
				}
				<div className="my-5">
					<button
						type="button"
						className="bcf-save-font inline-flex components-button is-primary"
						onClick={ insertGoogleFontPost }
						disabled={'loading' === addingFont ? true : false}
					>
						{__( 'Save Font', 'custom-fonts' )}
						{ 'loading' === addingFont && Custom_Fonts_Icons['saveFont'] }
					</button>
				</div>
			</div>
		</div>
	);
};

export default GoogleFont;
