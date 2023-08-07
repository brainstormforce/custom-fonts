import apiFetch from '@wordpress/api-fetch';

export const editFontToDB = (dispatch, fontId, googleFontData, cb) => {
    const formData = new window.FormData();
    formData.append( 'action', 'bcf_edit_font' );
    formData.append( 'security', bsf_custom_fonts_admin.edit_font_nonce );
    formData.append( 'font_type', 'google' );
    formData.append( 'font_id', fontId );
    formData.append( 'font_data', JSON.stringify( googleFontData ) );

    apiFetch( {
        url: bsf_custom_fonts_admin.ajax_url,
        method: 'POST',
        body: formData,
    } ).then( (response) => {
        if ( response.success ) {
                //dispatch that banner
                dispatch( { type: 'IS_DB_UPDATE_REQUIRED', isDbUpdateRequired: false } );
                if(cb) cb(response.data.fontId);
        }
    } );
}

export const deleteFontFromDB = (dispatch, fontId, cb) => {
    const formData = new window.FormData();

    formData.append( 'action', 'bcf_delete_font' );
    formData.append( 'security', bsf_custom_fonts_admin.delete_font_nonce );
    formData.append( 'font_id', fontId );

    apiFetch( {
        url: bsf_custom_fonts_admin.ajax_url,
        method: 'POST',
        body: formData,
    } ).then( (response) => {
        if ( response.success ) {
            dispatch( { type: 'IS_DB_UPDATE_REQUIRED', isDbUpdateRequired: false } );
            if(cb) cb(response.data.fontId);
        }
    } );
}

export const addFontToDB = ( dispatch, googleFontData, cb ) => {
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
            dispatch( { type: 'IS_DB_UPDATE_REQUIRED', isDbUpdateRequired: false } );
            if(cb) cb(response.data.fontId);
        }
    } );
};