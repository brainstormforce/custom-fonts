import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import apiFetch from '@wordpress/api-fetch';
import { useSelector, useDispatch } from 'react-redux';

const EditGoogleVariationItem = ({
	id,
	variation,
	localDataLength,
	handleVariationRemove
}) => {
	const getFontWeightTitle = ( weight ) => {
		switch ( weight ) {
			case '100':
				return __( 'Thin ', 'custom-fonts' ) + weight;
			case '200':
				return __( 'Extra Light ', 'custom-fonts' ) + weight;
			case '300':
				return __( 'Light ', 'custom-fonts' ) + weight;
			case '400':
				return __( 'Regular ', 'custom-fonts' ) + weight;
			case '500':
				return __( 'Medium ', 'custom-fonts' ) + weight;
			case '600':
				return __( 'Semi Bold ', 'custom-fonts' ) + weight;
			case '700':
				return __( 'Bold ', 'custom-fonts' ) + weight;
			case '800':
				return __( 'Extra Bold ', 'custom-fonts' ) + weight;
			case '900':
				return __( 'Black ', 'custom-fonts' ) + weight;
			default:
				return __( 'Weight ', 'custom-fonts' ) + weight;
		}
	}

	return (
		<div key={id} className="my-5 border border-light rounded-sm p-3.5">
			<h3 className="text-sm font-semibold text-heading">
				{__('Selected Variant', 'custom-fonts')}
			</h3>
			<div className="mt-3.5 flex flex-col gap-y-3.5">
				<div className="flex items-center justify-between">
					<div className="text-sm text-heading">
						{
							getFontWeightTitle(variation.font_weight)
						}
					</div>
					<div>
					{localDataLength > 1 && (
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							onClick={() =>
								handleVariationRemove(variation.id)
							}
						>
							<path
								d="M8.00078 0.800049C4.00078 0.800049 0.800781 4.00005 0.800781 8.00005C0.800781 12 4.00078 15.2 8.00078 15.2C12.0008 15.2 15.2008 12 15.2008 8.00005C15.2008 4.00005 12.0008 0.800049 8.00078 0.800049ZM8.00078 13.6C4.88078 13.6 2.40078 11.12 2.40078 8.00005C2.40078 4.88005 4.88078 2.40005 8.00078 2.40005C11.1208 2.40005 13.6008 4.88005 13.6008 8.00005C13.6008 11.12 11.1208 13.6 8.00078 13.6ZM4.80078 7.20005V8.80005H11.2008V7.20005H4.80078Z"
								fill="#007CBA"
							/>
						</svg>
					)}
					</div>
				</div>
			</div>
		</div>
	);
};

const EditGoogleFont = ({fontId, fontName}) => {
	const [advanceTab, setAdvanceTab] = useState(false);

	const dispatch = useDispatch();
	const restAllData = useSelector( ( state ) => state.fonts );
	const editFontId = parseInt( fontId );

	const toggleAdvanceTab = () => {
		setAdvanceTab(!advanceTab);
	};

	let toBeEditFont = {};
	restAllData.forEach(function(individualFont) {
		if ( editFontId === individualFont.id ) {
			toBeEditFont = individualFont;
		}
	});

	let editingFontData = {};
	if ( undefined === toBeEditFont['fonts-data'] || ! toBeEditFont['fonts-data'].length ) {
		editingFontData = toBeEditFont['fonts-data'];
	}

	const [editFontData, setEditGoogleFontData] = useState( editingFontData );
	const [ isLoading, setLoading ] = useState( false );

	useEffect(() => {
		dispatch( { type: 'SET_EDIT_FONT', payload: editFontData } );
	}, [editFontData]);

	const handleInputChange = (event, property) => {
		const value = event.target.value;

		setEditGoogleFontData((prevState) => ({
			...prevState,
			[property]: value,
		}));
	};

	const handleVariationChange = (event, id, property, attachment = '') => {
		const updatedVariations = editFontData.variations.map((variation) => {
			if (variation.id === id) {
				if( '' !== attachment ) {
					return {
						...variation,
						['font_file']: attachment.id,
						['font_url']: attachment.url,
					};
				} else {
					return {
						...variation,
						[property]: event.target.value,
					};
				}
			} else {
				return variation;
			}
		});

		setEditGoogleFontData({
			...editFontData,
			variations: updatedVariations,
		});
	};

	const addVariationOption = () => {
		const lastId =
			editFontData.variations[editFontData.variations.length - 1].id;
		const newId = lastId + 1;
		const newVariation = {
			id: newId.toString(),
			font_file: '',
			font_url: '',
			font_style: 'normal',
			font_weight: '',
		};
		const updatedVariations = [...editFontData.variations, newVariation];

		setEditGoogleFontData((prevState) => ({
			...prevState,
			variations: updatedVariations,
		}));
	};

	const handleVariationRemove = (id) => {
		const updatedVariations = editFontData.variations.filter(
			(variation) => variation.id !== id
		);

		setEditGoogleFontData({
			...editFontData,
			variations: updatedVariations,
		});
	};

	const updatingNewFontPost = ( e ) => {
		console.log( '***** Editing New Font *****' );
		e.preventDefault();

		setLoading( 'loading' );
		const formData = new window.FormData();

		formData.append( 'action', 'bcf_edit_font' );
		formData.append( 'security', bsf_custom_fonts_admin.edit_font_nonce );
		formData.append( 'font_type', 'google' );
		formData.append( 'font_id', fontId );
		formData.append( 'font_data', JSON.stringify( editFontData ) );

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

	return (
		<div>
			<div>
				<p className="mb-5 text-xl font-semibold">
					{__( 'Edit Font', 'custom-fonts' )}
				</p>
				<div className="mb-5">
					<div
						onClick={toggleAdvanceTab}
						className="flex items-center px-1 gap-x-2"
					>
						<svg
							width="6"
							height="8"
							viewBox="0 0 6 8"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className={
								advanceTab
									? "rotate-90"
									: "" + "transition-transform duration-300"
							}
						>
							<path
								d="M0.400391 0.800049L5.20039 4.02405L0.400391 7.20005L0.400391 0.800049Z"
								fill="#007CBA"
							/>
						</svg>

						<label
							className="w-full text-sm text-heading"
							htmlFor=""
						>
							{__( 'Advanced Options', 'custom-fonts' )}
						</label>
					</div>
				</div>

				{editFontData.variations.map((variation) => (
					<EditGoogleVariationItem
						key={variation.id}
						variation={variation}
						localDataLength={editFontData.variations.length}
						handleVariationRemove={handleVariationRemove}
					/>
				))}

				<div className="my-5">
					<button
						type="button"
						className="inline-flex px-4 py-2 border border-transparent text-sm shadow-sm text-white bg-primary focus-visible:bg-primaryDark hover:bg-primaryDark focus:outline-none"
						onClick={ updatingNewFontPost }
					>
						{__( 'Save Font', 'custom-fonts' )}
						{ 'loading' === isLoading && (
							<svg className="animate-spin -mr-1 ml-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
						) }
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditGoogleFont;
