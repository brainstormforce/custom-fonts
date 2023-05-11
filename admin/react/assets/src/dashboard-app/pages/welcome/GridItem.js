import React, { useState } from "react";
import { __ } from "@wordpress/i18n";
import apiFetch from '@wordpress/api-fetch';

const ListItem = ({ item }) => {
	const [checkDelete, setCheckDelete] = useState(false);

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

	return (
		<div className="p-6">
			<div className="flex justify-between items-center">
				<style id={`bcf-custom-font-${item.id}-css`}> {item['fonts-face']} </style>
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
						)
					}
				</div>
			</div>
			<div className="mt-6">
				<h1 className="text-5xl" style={{  fontFamily: item.title, fontWeight: "normal", fontSize: "2em" }}> {item.title} </h1>
			</div>
		</div>
	);
};

export default ListItem;
