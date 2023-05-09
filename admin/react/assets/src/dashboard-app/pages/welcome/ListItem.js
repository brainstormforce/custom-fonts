import React, { useState } from "react";
import { __ } from "@wordpress/i18n";
import { useSelector, useDispatch } from 'react-redux';
import apiFetch from '@wordpress/api-fetch';

const ListItem = () => {
	const dispatch = useDispatch();

	const [active, setActive] = useState(false);
	const [checkDelete, setCheckDelete] = useState(false);
	const fontsData = useSelector( ( state ) => state.fonts );

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
		fontsData && fontsData.map(( item, key ) => (
			<div key={key} className={`${active || checkDelete ? "bg-white" : ""} transition-colors ${key ? '' : ''}`}>
				<div className="flex items-center justify-between py-5 border-b border-light list-font-title">
					<style id={`bcf-custom-font-${item.id}-css`}> {item['fonts-face']} </style>
					<div className="flex items-center px-6">
						<h1 className="text-xl" style={{  fontFamily: item.title, fontWeight: "normal", fontSize: "2em" }}> {item.title} </h1>
						<div className="ml-3 text-sm"> {`(${item['fonts-data']['variations'] ? item['fonts-data']['variations'].length : 0} ${__( 'variants', 'custom-fonts' )})`} </div>
					</div>
					<div className="flex px-6">
						{checkDelete ? (
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
								>
									{__('Remove', 'custom-fonts')}
								</div>
							</div>
						) : (
							<div className="flex gap-x-6">
								<div
									onClick={() => getEditFont()}
									data-font_id={item.id}
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
						)}
	
						<div
							onClick={() => setActive(!active)}
							className="ml-11 cursor-pointer"
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 20 20"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className={`${
									active ? "rotate-180" : ""
								} transition-transform duration-150 ease-in-out`}
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M5.23017 7.20938C5.52875 6.92228 6.00353 6.93159 6.29063 7.23017L10 11.1679L13.7094 7.23017C13.9965 6.93159 14.4713 6.92228 14.7698 7.20938C15.0684 7.49647 15.0777 7.97125 14.7906 8.26983L10.5406 12.7698C10.3992 12.9169 10.204 13 10 13C9.79599 13 9.60078 12.9169 9.45938 12.7698L5.20938 8.26983C4.92228 7.97125 4.93159 7.49647 5.23017 7.20938Z"
									fill="#7E7E7E"
								/>
							</svg>
						</div>
					</div>
				</div>
				{active && item['fonts-data']['variations'] && (
					<div className="px-6 list-font-variations">
						{
							item['fonts-data']['variations'].map(( varItem, varKey ) => (
								<div key={varKey} className="py-5 font-variation-item">
									<div className="text-sm text-neutral mb-3"> { getFontWeightTitle( varItem.font_weight ) } </div>
									<h3 className="text-5xl text-heading" style={{  fontFamily: item.title, fontWeight: varItem.font_weight, fontSize: "2em" }}>
										{__('How vexingly quick daft zebras jump!', 'custom-fonts')}
									</h3>
								</div>
							))
						}
					</div>
				)}
			</div>
		))
	);
};

export default ListItem;
