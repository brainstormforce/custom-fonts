import React, { useState, useEffect } from "react";
import { __, sprintf } from "@wordpress/i18n";
import apiFetch from '@wordpress/api-fetch';
import EditFont from "../fonts/edit/EditFont";
import { useSelector, useDispatch } from 'react-redux';
import Custom_Fonts_Icons from "@Common/svg-icons";


const ListItem = ({ item }) => {
	const [active, setActive] = useState(false);
	const [checkDelete, setCheckDelete] = useState(false);
	const [editFontId, setEditFontId] = useState(item.id);
	const [editFontType, setEditFontType] = useState(item['font-type'] ? item['font-type'] : 'local');
	const [editFontName, setEditFontName] = useState(item.title);
	const [openPopup, setOpenPopup] = useState(false);
	const [removeTitle, setRemoveTitle] = useState(__( 'Remove', 'custom-fonts'));

	const updatedEditData = useSelector( ( state ) => state.editFont );
	const [editFontData, setEditFontData] = useState(updatedEditData);

	const dispatch = useDispatch();

	useEffect( () => {
		if ( openPopup ) {
			setEditFontData( editFontData );
			dispatch( { type: 'SET_EDIT_FONT', payload: editFontData } );
		} else {
			setEditFontData( null );
			dispatch( { type: 'SET_EDIT_FONT', payload: null } );
		}
	}, [openPopup] );

	const deleteFontPost = ( e ) => {
		e.preventDefault();
		e.stopPropagation();

		setRemoveTitle(__( 'Removing...', 'custom-fonts'));
		const formData = new window.FormData();

		formData.append( 'action', 'bcf_delete_font' );
		formData.append( 'security', bsf_custom_fonts_admin.delete_font_nonce );
		formData.append( 'font_id', e.target.dataset.font_id );

		apiFetch( {
			url: bsf_custom_fonts_admin.ajax_url,
			method: 'POST',
			body: formData,
		} ).then( (response) => {
			if ( response.success ) {
				setTimeout( () => {
					window.location.reload();
				}, 500 );
			}
		} );
	};

	const getFontWeightTitle = ( weight, type, style ) => {
		if ( undefined === weight ) {
			weight = '400';
		}
		let updatedWeight = weight,
			oldWeight = ( 'google' === type ) ? weight : style;
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

	const setupEditFontScreen = (e) => {
		e.stopPropagation();

		const fontId = e.target.dataset.font_id;
		const fontType = e.target.dataset.font_type;
		const fontName = e.target.dataset.font_name;

		setOpenPopup(! openPopup);
		setEditFontId(fontId);
		setEditFontType(fontType);
		setEditFontName(fontName);
	}

	const getAssetDetail = ( fontItem ) => {
		const fontType = fontItem['font-type'] ? fontItem['font-type'] : 'local';
		if ( fontType === 'local' ) {
			return <style id={`bcf-custom-font-${fontItem.id}-css`}> {fontItem['fonts-face']} </style>
		} else {
			const fontName = fontItem.title.replace( / /g, "+" );
			return <link rel="stylesheet" id={`bcf-custom-font-${fontItem.id}-css`} href={`${bsf_custom_fonts_admin.googleFontAPI}=${fontName}&ver=${fontItem.id}`} media="all"></link>
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

	const getFontAssetLink = (type, font, weight, version) => {
		if ( type === 'local' ) {
			return '';
		}
		const fontName = font.replace( / /g, "+" );
		return <link rel='stylesheet' id={`bcf-google-font-${version}-link`} href={`${bsf_custom_fonts_admin.googleFontAPI}=${fontName}:${weight}&display=fallback&ver=${version+1}`} media='all' />
	}

	const getFontStyle = (type, style, weight) => {
		let considerStyler = ( '' === type || 'local' === type ) ? style : weight;
		if ( undefined === considerStyler || '' === considerStyler ) {
			return 'normal';
		}
		if ( considerStyler.includes('italic') ) {
			return 'italic';
		}
		return style;
	}

	const expandFontItem = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setActive(!active);
	}

	const setupDeleteFontPost = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setCheckDelete(true)
	}

	const setupCancelDeletingFontPost = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setCheckDelete(false);
	}

	return (
		<>
			<div className={`${active || checkDelete ? "bg-white active-state" : ""} bg-white transition-colors hover:bg-[#f6f7f7]`}>
				<div className="flex items-center title-area justify-between py-5 border-b border-light list-font-title hover:cursor-pointer" onClick={expandFontItem}>
					{ getAssetDetail(item) }
					<div className="flex items-center px-6 mobile:block">
					<h1 className="text-xl" style={{ fontFamily: item.title, fontWeight: "normal", fontSize: "1.5rem" }}> {item['fonts-data'].font_name} </h1>
						<div className="sm:ml-3 mobile:mt-3 text-sm"> {`(${item['fonts-data']['variations'] ? item['fonts-data']['variations'].length : 0} ${__( 'variants', 'custom-fonts' )})`} </div>
					</div>
					<div className="flex px-6">
						{checkDelete ? (
							<div className="flex gap-x-6">
								<div className="text-secondary cursor-pointer">
									{
										sprintf(
											/* translators: %s: Font name. */
											__( 'Remove "%s" font?', 'custom-fonts' ),
											item.title
										)
									}
								</div>
								<div
									onClick={setupCancelDeletingFontPost}
									className="text-neutral cursor-pointer"
								>
									{__('Cancel', 'custom-fonts')}
								</div>

								<div
									className="text-danger cursor-pointer"
									onClick={deleteFontPost}
									data-font_id={item.id}
									data-font_type={item['font-type']}
									data_font_name={item.title}
								>
									{removeTitle}
								</div>
							</div>
						) : (
							<div className="flex gap-x-6">
								<div
									onClick={setupEditFontScreen}
									data-font_id={item.id}
									data-font_type={item['font-type']}
									data_font_name={item.title}
									className="text-primary cursor-pointer"
								>
									{__('Edit', 'custom-fonts')}
								</div>

								<div
									onClick={setupDeleteFontPost}
									className="text-danger cursor-pointer"
								>
									{__('Remove', 'custom-fonts')}
								</div>
							</div>
						)}

						<div
							onClick={() => setActive(!active)}
							className="sm:ml-11 mobile:ml-2 cursor-pointer"
						>
							<span className={`${active ? "rotate-180" : ""
								} transition-transform duration-150 ease-in-out`}>
								{Custom_Fonts_Icons['dropdownlistitem']}
							</span>

						</div>
					</div>
				</div>
				{active && item['fonts-data']['variations'] && (
					<div className="px-6 list-font-variations bg-[#f6f7f7]">
						{
							item['fonts-data']['variations'].map(( varItem, varKey ) => (
								<div key={varKey} className="py-5 font-variation-item">
									{getFontAssetLink(item['font-type'], item.title, varItem.font_weight, varKey)}
									<div className="text-sm text-neutral mb-3 font-normal"> { getFontWeightTitle( varItem.font_weight, item['font-type'], varItem.font_style ) } </div>
									<h3 className="text-xl text-heading" style={{  fontFamily: item.title, fontSize: "1.3rem", fontStyle:getFontStyle(item['font-type'], varItem.font_style, varItem.font_weight), fontWeight: getRenderFontWeight(varItem.font_weight) }}>
										{__('How vexingly quick daft zebras jump!', 'custom-fonts')}
									</h3>
								</div>
							))
						}
					</div>
				)}
			</div>

			{
				<EditFont
					font={editFontId}
					fontType={editFontType}
					fontName={editFontName}
					openPopup={openPopup}
					setOpenPopup={setOpenPopup}
				/>
			}
		</>
	);
};

export default ListItem;
