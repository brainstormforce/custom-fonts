import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import apiFetch from '@wordpress/api-fetch';
import EditFont from "../fonts/edit/EditFont";
import { useSelector, useDispatch } from 'react-redux';

const ListItem = ({ item }) => {
	const [checkDelete, setCheckDelete] = useState(false);

	const [editFontId, setEditFontId] = useState(item.id);
	const [editFontType, setEditFontType] = useState(item['font-type'] ? item['font-type'] : 'local');
	const [editFontName, setEditFontName] = useState(item.title);
	const [openPopup, setOpenPopup] = useState(false);

	const updatedEditData = useSelector( ( state ) => state.editFont );
	const [editFontData, setEditFontData] = useState(updatedEditData);

	const dispatch = useDispatch();

	const setupEditFontScreen = (e) => {
		const fontId = e.target.dataset.font_id;
		const fontType = e.target.dataset.font_type;
		const fontName = e.target.dataset.font_name;

		setOpenPopup(! openPopup);
		setEditFontId(fontId);
		setEditFontType(fontType);
		setEditFontName(fontName);
	}

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
		console.log( '***** Deleting Font *****' );
		e.preventDefault();
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

	const getAssetDetail = ( fontItem ) => {
		const fontType = fontItem['font-type'] ? fontItem['font-type'] : 'local';
		if ( fontType === 'local' ) {
			return <style id={`bcf-custom-font-${fontItem.id}-css`}> {fontItem['fonts-face']} </style>
		} else {
			const fontName = fontItem.title.replace( / /g, "+" );
			return <link rel="stylesheet" id={`bcf-custom-font-${fontItem.id}-css`} href={`https://fonts.googleapis.com/css?family=${fontName}&ver=${fontItem.id}`} media="all"></link>
		}
	}

	return (
		<>
			<div className={`${checkDelete ? "bg-white" : ""} p-6`}>
				<div className="flex justify-between items-center">
					{ getAssetDetail(item) }
					<div className="text-neutral"> {`${item['fonts-data']['variations'] ? item['fonts-data']['variations'].length : 0} ${__( 'variants', 'custom-fonts' )}`} </div>
					<div className="">
						{ checkDelete ? (
								<div className="flex gap-x-6">
									<div className="text-secondary cursor-pointer">
										{__('Remove', 'custom-fonts') + ' "' + item.title + '" ' + __('font?', 'custom-fonts')}
									</div>
									<div
										onClick={() => setCheckDelete(false)}
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
										{__('Remove', 'custom-fonts')}
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
										onClick={() => setCheckDelete(true)}
										className="text-danger cursor-pointer"
									>
										{__('Remove', 'custom-fonts')}
									</div>
								</div>
							)
						}
					</div>
				</div>
				<div className="mt-6">
					<h1 className="text-5xl" style={{  fontFamily: item.title, fontWeight: "normal", fontSize: "2em" }}> {item.title} </h1>
				</div>
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
