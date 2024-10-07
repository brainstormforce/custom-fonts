import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import apiFetch from '@wordpress/api-fetch';
import { useSelector, useDispatch } from 'react-redux';
import Custom_Fonts_Icons from "@Common/svg-icons";

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

	const [fontFileName, setFontFileName] = useState(variation.font_url ? variation.font_url : '');

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
			multiple: true, // Set to true to allow multiple files to be selected
		})

		// When an image is selected in the media frame...
		frame.on( 'select', function() {
			// Get media attachment details from the frame state
			var attachments = frame.state().get('selection').map(
				function( attachment ) {
					attachment.toJSON();
					return attachment;
				}
			);

			//loop through the array and do things with each attachment & Validate file extensions.
			let fontFileNames = [];
			for (let i = 0; i < attachments.length; ++i) {
				// Check if the file extension is allowed
				const allowedExtensions = ['.ttf', '.otf', '.woff', '.woff2', '.eot', '.svg'];
				const fileName = attachments[i].attributes.url.toLowerCase();
				const extension = fileName.substr(fileName.lastIndexOf('.'));
				if (allowedExtensions.includes(extension)) {
					fontFileNames.push(attachments[i].attributes.url);
				} else {
					// Reject the file upload and display an error message
					alert(
						__(
							'Invalid file type. Only .ttf, .otf, .woff, .woff2, .svg files are allowed.',
							'custom-fonts'
						)
					);
					return;
				}
			}
			setFontFileName( fontFileNames );
			handleVariationChange(
				event,
				variation.id,
				"font_file",
				fontFileNames
			);
		});
		// Finally, open the modal on click
		frame.open();
	};

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
						{ fontFileName.length >= 1 ? __( 'Font files chosen', 'custom-fonts' ) : __('No file chosen', 'custom-fonts') }
					</h2>
					<div className="flex items-center justify-end gap-x-4 font-triggers">
						<span onClick={() => setToggleView(true)}>
							{Custom_Fonts_Icons['arrowIcon2']}
						</span>

						{localDataLength > 1 && (
							<span onClick={() => handleVariationRemove(variation.id)}>
								{Custom_Fonts_Icons['localremove']}
							</span>
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
								<span className="font-filename"> {fontFileName.length >= 1 ? __('Font files:', 'custom-fonts') : __('No file chosen', 'custom-fonts')} </span>
								<div className="font-triggers">
									<span onClick={() => setToggleView(false)}>
										{Custom_Fonts_Icons['deopdownarrow2']}
									</span>
									{localDataLength > 1 && (
										<span onClick={() => handleVariationRemove(variation.id)}>
											{Custom_Fonts_Icons['localremove']}
										</span>
									)}
								</div>
						</div>
						{
							( Array.isArray( fontFileName ) && fontFileName.length >= 1 ) && (
								fontFileName.map(( file, index ) => (
									<div className="text-xs text-neutral mt-1.5" key={index}>
										{ `${__( 'File ', 'custom-fonts' )} ${index + 1}: ${ getFileName(file) }` }
									</div>
								))
							)
						}
						<div className="text-xs text-neutral mt-1.5 italic">
							{`${__( 'Supported file types: ', 'custom-fonts' )} .otf, .ttf, .woff, .woff2`}
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

	const handleVariationChange = (event, id, property, attachment = []) => {
		const updatedVariations = editFontData.variations.map((variation) => {
			if (variation.id === id) {
				if( attachment.length > 0 ) {
					let attachmentDetails = [];
					attachment.map(( file, index ) => (
						attachmentDetails.push(file)
					));
					return {
						...variation,
						['font_url']: attachmentDetails,
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

		apiFetch({
			url: bsf_custom_fonts_admin.ajax_url,
			method: 'POST',
			body: formData,
		})
		.then((response) => {
			if (response.success) {
				setTimeout(() => {
					window.location = `${bsf_custom_fonts_admin.app_base_url}`;
				}, 500);
			}
			setLoading(false);
		})
		.catch((error) => {
			console.error('Error during API request:', error);
			setLoading(false);
		});
		
	};

	return (
		<div>
			<div>
				<p className="mb-5 text-xl font-semibold">
					{__( 'Edit Font', 'custom-fonts' )}
				</p>
				<input className="w-full" type="text" onChange={(e) => handleInputChange(e,"font_name")} value={editFontData.font_name}></input>
				<p>&nbsp;</p>
				<div className="mb-5">
					<div
						onClick={toggleAdvanceTab}
						className="flex items-center gap-x-2 hover:cursor-pointer"
					>
						<label
							className="text-sm text-heading"
							htmlFor=""
						>
							{__('Advanced Options', 'custom-fonts')}
						</label>
						{Custom_Fonts_Icons['smallarrow']}
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
						{__('Add Font Variation', 'custom-fonts')}
					</div>
					<div>
						{Custom_Fonts_Icons["plusicon2"]}
					</div>
				</div>

				<button
					type="button"
					className="bcf-save-font inline-flex components-button is-primary mb-5"
					onClick={updatingNewFontPost}
					disabled={'loading' === isLoading ? true : false}
				>
					{__('Save Font', 'custom-fonts')}
					{'loading' === isLoading && Custom_Fonts_Icons['loadingSpinner']}

				</button>
			</div>
		</div>
	);
};

export default EditLocalFont;
