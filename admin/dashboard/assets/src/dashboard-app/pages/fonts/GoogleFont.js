import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { __ } from "@wordpress/i18n";
import { useSelector } from 'react-redux';
import { editFontToDB, deleteFontFromDB, addFontToDB } from "../../../utils/useApis";
import { Snackbar } from "@wordpress/components";
import Custom_Fonts_Icons from "@Common/svg-icons";

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
				<span onClick={() => (disable ? doNothing() : handleVariationRemove(variation.id))}>
					{Custom_Fonts_Icons['VariationRemoveIcon']}
				</span>
			</div>
		</div>
	);
};

const GoogleFont = () => {
	const googleFontData = useSelector( ( state ) => state.googleFont );
	const isDbUpdateRequired = useSelector( ( state ) => state.isDbUpdateRequired);
	const editType = useSelector( ( state ) => state.editType);
	const googleFonts = bsf_custom_fonts_admin.googleFonts;
	const dispatch = useDispatch();
	const [gFont, setGFont] = useState('');
	const [fontId, setFontId] = useState(null);
	const [showMessage, setShowMessage] = useState('');

	const fontUpdated = (operationType, fId) => {
		let message;
		switch (operationType) {
			case 'add':
				message = __( 'Font Added Successfully!', 'custom-fonts' );
				break;
			case 'edit':
				if(editType === 'remove') message = __( 'Variation Removed Successfully!', 'custom-fonts' );
				else message = __( 'Variation Added Successfully!', 'custom-fonts' );
				break;
			case 'delete':
				message = __( 'Font Removed Successfully!', 'custom-fonts' );
				setFontId(null);
				break;
			default:
				message = '';
		}

		if (fId) setFontId(fId);
		setShowMessage(message);
		setTimeout(() => setShowMessage(''), 5000);
	}

	useEffect(() => {
		if (isDbUpdateRequired && googleFontData) {
			if (fontId) googleFontData.variations.length !== 0 ? editFontToDB(dispatch, fontId, googleFontData, () => { fontUpdated('edit') }) : deleteFontFromDB(dispatch, fontId, () => { fontUpdated('delete') });
			else googleFontData.variations.length === 1 ? addFontToDB(dispatch, googleFontData, (fId) => { fontUpdated('add', fId) }) : null;
		}
	}, [isDbUpdateRequired])

	function handleGoogleFontChange(e) {
		setGFont(e.target.value);
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
		dispatch( { type: 'IS_DB_UPDATE_REQUIRED', payload: {isDbUpdateRequired: true, editType:'remove'} } );
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
				{ showMessage.length > 0 ? <div className={showMessage.length > 0 ? `snack-bar-${showMessage.toLowerCase().includes('added') || showMessage.toLowerCase().includes('updated') ? 'added' : 'removed'}` : ''}>
					<Snackbar>{showMessage}</Snackbar>
				</div> : null }
			</div>
		</div>
	);
};

export default GoogleFont;
