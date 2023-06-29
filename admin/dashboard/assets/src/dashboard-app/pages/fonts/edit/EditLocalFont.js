import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import apiFetch from '@wordpress/api-fetch';
import { useSelector, useDispatch } from 'react-redux';

const EditLocalVariationItem = ({
	id,
	variation,
	localDataLength,
	handleVariationRemove,
	handleVariationChange,
}) => {
	const [toggleView, setToggleView] = useState(false);

	const getFileName = ( url ) => {
		const parts = url.split('/');
		return parts.at(-1);
	}

	const [fontFileName, setFontFileName] = useState(variation.font_url ? getFileName(variation.font_url) : '');

	let frame;
	const fontFileUploader = (event) => {
		event.preventDefault()

		// If the media frame already exists, reopen it.
		if ( frame ) {
			frame.open()
			return
		}

		// Create a new media frame
		frame = wp.media({
			title: __( 'Select or Upload Font', 'custom-fonts' ),
			button: {
				text: __( 'Use Font', 'custom-fonts' ),
			},
			multiple: false, // Set to true to allow multiple files to be selected
		})

		// When an image is selected in the media frame...
		frame.on( 'select', function() {
			// Get media attachment details from the frame state
			let attachment = frame.state().get('selection').first().toJSON();
			setFontFileName( attachment.filename );
			handleVariationChange(
				event,
				variation.id,
				"font_file",
				attachment
			);
		});

		// Finally, open the modal on click
		frame.open();
	}

	const expandFileField = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setToggleView(true)
	}

	const weightSelections = Object.entries( bsf_custom_fonts_admin.fontWeightList ).map( ( [ weight, label ] ) => {
		return( <option value={weight} key={weight}> { label } </option> )
	} );

	return (
		<div key={id} className="border border-light rounded-sm variation-file-field mb-4">
			{!toggleView ? (
				<div className="flex items-center justify-between p-3.5 relative" onClick={expandFileField}>
					<h2 className="text-sm font-semibold text-secondary">
						{ '' !== fontFileName ? fontFileName : __('No file chosen', 'custom-fonts') }
					</h2>
					<div className="flex items-center justify-end gap-x-4 font-triggers">
						<svg
							onClick={() => setToggleView(true)}
							width="12"
							height="8"
							viewBox="0 0 12 8"
							className="arrow-icon h-[40px]"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M2.00039 0.800049L6.00039 4.80005L10.0004 0.800049L11.6004 1.60005L6.00039 7.20005L0.400391 1.60005L2.00039 0.800049Z"
								fill="#7E7E7E"
							/>
						</svg>

						{localDataLength > 1 && (
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="cursor-pointer remove-icon h-[40px]"
								onClick={() =>
									handleVariationRemove(variation.id)
								}
							>
								<path
									d="M8.00078 0.800049C4.00078 0.800049 0.800781 4.00005 0.800781 8.00005C0.800781 12 4.00078 15.2 8.00078 15.2C12.0008 15.2 15.2008 12 15.2008 8.00005C15.2008 4.00005 12.0008 0.800049 8.00078 0.800049ZM8.00078 13.6C4.88078 13.6 2.40078 11.12 2.40078 8.00005C2.40078 4.88005 4.88078 2.40005 8.00078 2.40005C11.1208 2.40005 13.6008 4.88005 13.6008 8.00005C13.6008 11.12 11.1208 13.6 8.00078 13.6ZM4.80078 7.20005V8.80005H11.2008V7.20005H4.80078Z"
									fill="rgb(230 80 84 / 1)"
								/>
							</svg>
						)}
					</div>
				</div>
			) : (
				<div className="relative p-4 bg-theme-bg edit-font-variation-wrap">
					<div className="mb-4 border-b border-light pb-4">
						<div className="flex items-center gap-x-4">
							<input name={`variation[${variation.id}][font_file]`} type="hidden" value={variation.font_file} />
							<input name={`variation[${variation.id}][font_url]`} type="hidden" value={variation.font_url} />
							<button
								onClick={(event) =>
									fontFileUploader(event)
								}
								className="font-file-uploader btn btn-primary"
							>
								{ __( "Choose File", 'custom-fonts' ) }
							</button>
							<span className="font-filename"> { '' !== fontFileName ? fontFileName : __( 'No file chosen', 'custom-fonts' ) } </span>
							<div className="font-triggers">
								<svg
									onClick={() => setToggleView(false)}
									width="12"
									height="8"
									viewBox="0 0 12 8"
									className="arrow-icon h-[40px]"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M2.00039 7.19995L6.00039 3.19995L10.0004 7.19995L11.6004 6.39995L6.00039 0.799951L0.400391 6.39995L2.00039 7.19995Z"
										fill="#7E7E7E"
									/>
								</svg>
								{localDataLength > 1 && (
									<svg
										width="16"
										height="16"
										viewBox="0 0 16 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="cursor-pointer remove-icon h-[40px]"
										onClick={() =>
											handleVariationRemove(variation.id)
										}
									>
										<path
											d="M8.00078 0.800049C4.00078 0.800049 0.800781 4.00005 0.800781 8.00005C0.800781 12 4.00078 15.2 8.00078 15.2C12.0008 15.2 15.2008 12 15.2008 8.00005C15.2008 4.00005 12.0008 0.800049 8.00078 0.800049ZM8.00078 13.6C4.88078 13.6 2.40078 11.12 2.40078 8.00005C2.40078 4.88005 4.88078 2.40005 8.00078 2.40005C11.1208 2.40005 13.6008 4.88005 13.6008 8.00005C13.6008 11.12 11.1208 13.6 8.00078 13.6ZM4.80078 7.20005V8.80005H11.2008V7.20005H4.80078Z"
											fill="rgb(230 80 84 / 1)"
										/>
									</svg>
								)}
							</div>
						</div>

						<div className="text-xs text-neutral mt-1.5">
							Supported file types: .otf, .ttf, .woff, .woff2
						</div>
					</div>
					<div className="grid grid-cols-2 gap-x-3">
						<div className="col-span-1">
							<label
								className="w-full text-sm text-heading"
								htmlFor={`variation[${variation.id}][font_style]`}
							>
								{__('Font Style:', 'custom-fonts' )}
							</label>
							<div className="mt-1.5">
								<select
									name={`variation[${variation.id}][font_style]`}
									value={variation.font_style}
									onChange={(event) =>
										handleVariationChange(
											event,
											variation.id,
											"font_style"
										)
									}
									className="w-full"
								>
									<option value="normal"> {__( 'Normal', 'custom-fonts' )} </option>
									<option value="italic"> {__( 'Italic', 'custom-fonts' )} </option>
									<option value="oblique"> {__( 'Oblique', 'custom-fonts' )} </option>
								</select>
							</div>
						</div>
						<div className="col-span-1">
							<label
								className="w-full text-sm text-heading"
								htmlFor={`variation[${variation.id}][font_weight]`}
							>
								{__( 'Font Weight:', 'custom-fonts' )}
							</label>
							<div className="mt-1.5">
								<select
									name={`variation[${variation.id}][font_weight]`}
									value={ undefined === variation.font_weight ? '400' : variation.font_weight }
									className="w-full"
									onChange={(event) =>
										handleVariationChange(
											event,
											variation.id,
											"font_weight"
										)
									}
								>
									{weightSelections}
								</select>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

const EditLocalFont = ({fontId}) => {
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

	const [editFontData, setEditLocalFontData] = useState( toBeEditFont['fonts-data'] );
	const [ isLoading, setLoading ] = useState( false );

	useEffect(() => {
		dispatch( { type: 'SET_EDIT_FONT', payload: editFontData } );
	}, [editFontData]);

	const handleInputChange = (event, property) => {
		const value = event.target.value;

		setEditLocalFontData((prevState) => ({
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

		setEditLocalFontData({
			...editFontData,
			variations: updatedVariations,
		});
	};

	const addVariationOption = () => {
		const lastId =
			editFontData.variations[editFontData.variations.length - 1].id;
		const newId = lastId + 1;
		const newVariation = {
			id: newId,
			font_file: '',
			font_url: '',
			font_style: 'normal',
			font_weight: '400',
		};
		const updatedVariations = [...editFontData.variations, newVariation];

		setEditLocalFontData((prevState) => ({
			...prevState,
			variations: updatedVariations,
		}));
	};

	const handleVariationRemove = (id) => {
		const updatedVariations = editFontData.variations.filter(
			(variation) => variation.id !== id
		);

		setEditLocalFontData({
			...editFontData,
			variations: updatedVariations,
		});
	};

	const updatingNewFontPost = ( e ) => {
		e.preventDefault();

		if ( '' === editFontData.font_name ) {
			window.alert(
				__( 'Make sure to provide valid details.', 'custom-fonts' )
			);
			return;
		}

		setLoading( 'loading' );
		const formData = new window.FormData();

		formData.append( 'action', 'bcf_edit_font' );
		formData.append( 'security', bsf_custom_fonts_admin.edit_font_nonce );
		formData.append( 'font_type', 'local' );
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
						className="flex items-center gap-x-2 hover:cursor-pointer"
					>
						<label
							className="text-sm text-heading"
							htmlFor=""
						>
							{__( 'Advanced Options', 'custom-fonts' )}
						</label>
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
					</div>
					{advanceTab && (
						<div
							className={`transition-opacity duration-300 ease-in-out mt-3 ${
								advanceTab
									? "opacity-100 block"
									: "opacity-0 hidden"
							}`}
						>
							<div className="mb-3">
								<label
									className="w-full text-[13px] text-heading"
									htmlFor="font_fallback"
								>
									{__( 'Font Fallback:', 'custom-fonts' )}
								</label>
								<div className="mt-1.5">
									<input
										className="w-full"
										type="text"
										name="font_fallback"
										value={editFontData.font_fallback}
										onChange={(event) =>
											handleInputChange(
												event,
												"font_fallback"
											)
										}
									/>
								</div>
								<span className="mt-1.5 text-xs text-neutral">
									{__( 'Separate font names with comma(,). eg.', 'custom-fonts' )}
									Arial, Serif
								</span>
							</div>
							<div className="mb-5">
								<label
									className="w-full text-[13px] text-heading"
									htmlFor="font_display"
								>
									{__( 'Font Display:', 'custom-fonts' )}
								</label>
								<div className="mt-1.5">
									<select
										className="w-full"
										name="font_display"
										value={editFontData.font_display}
										onChange={(event) =>
											handleInputChange(
												event,
												"font_display"
											)
										}
									>
										<option value="auto"> {__( 'auto', 'custom-fonts' )} </option>
										<option value="block"> {__( 'block', 'custom-fonts' )} </option>
										<option value="swap"> {__( 'swap', 'custom-fonts' )} </option>
										<option value="fallback"> {__( 'fallback', 'custom-fonts' )} </option>
										<option value="optional"> {__( 'optional', 'custom-fonts' )} </option>
									</select>
								</div>
							</div>
						</div>
					)}
				</div>

				{editFontData.variations.map((variation) => (
					<EditLocalVariationItem
						key={variation.id}
						variation={variation}
						localDataLength={editFontData.variations.length}
						handleVariationRemove={handleVariationRemove}
						handleVariationChange={handleVariationChange}
					/>
				))}

				<div
					className="flex items-center gap-x-1 my-5 cursor-pointer"
					onClick={addVariationOption}
				>
					<div className="text-sm text-primary">
						{__( 'Add Font Variation', 'custom-fonts' )}
					</div>
					<div>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M7.9998 0.800049C3.9998 0.800049 0.799805 4.00005 0.799805 8.00005C0.799805 12 3.9998 15.2 7.9998 15.2C11.9998 15.2 15.1998 12 15.1998 8.00005C15.1998 4.00005 11.9998 0.800049 7.9998 0.800049ZM7.9998 13.6C4.8798 13.6 2.3998 11.12 2.3998 8.00005C2.3998 4.88005 4.8798 2.40005 7.9998 2.40005C11.1198 2.40005 13.5998 4.88005 13.5998 8.00005C13.5998 11.12 11.1198 13.6 7.9998 13.6ZM8.7998 4.80005H7.1998V7.20005H4.7998V8.80005H7.1998V11.2H8.7998V8.80005H11.1998V7.20005H8.7998V4.80005Z"
								fill="#007CBA"
							/>
						</svg>
					</div>
				</div>

				<button
					type="button"
					className="bcf-save-font inline-flex components-button is-primary mb-5"
					onClick={ updatingNewFontPost }
					disabled={'loading' === isLoading ? true : false}
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
	);
};

export default EditLocalFont;
