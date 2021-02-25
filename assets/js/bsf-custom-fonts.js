(function($){

	/**
	 * Bsf Custom Fonts
	 *
	 * @class BsfCustomFonts
	 * @since 1.0.0
	 */

	BsfCustomFonts = {

		/**
		 * Initializes a Bsf Custom Fonts.
		 *
		 * @since 1.0
		 * @method init
		 */
		init: function()
		{
			// Init.
			this._fileUploads();
		},
		/**
		 * Font File Uploads
		 * parallax.
		 *
		 * @since 1.0.0
		 * @access private
		 * @method _fileUploads
		 */
		_fileUploads: function()
		{
			var file_frame;
			window.inputWrapper = '';
			$( document.body ).on('click', '.bsf-custom-fonts-upload', function(event) {
				event.preventDefault();
				var button = $(this),
    				button_type = button.data('upload-type');
    				window.inputWrapper = $(this).closest('.bsf-custom-fonts-file-wrap');

			    // If the media frame already exists, reopen it.
			    if ( file_frame ) {
			      file_frame.open();
			      return;
			    }

			     // Create a new media frame
			    file_frame = wp.media.frames.file_frame = wp.media({
			     	multiple: false  // Set to true to allow multiple files to be selected
			    });

			     // When an image is selected in the media frame...
    			file_frame.on( 'select', function() {

    				 // Get media attachment details from the frame state
      				var attachment = file_frame.state().get('selection').first().toJSON();
      					window.inputWrapper.find( '.bsf-custom-fonts-link' ).val(attachment.url);
      			});
      			// Finally, open the modal
				file_frame.open();
			});
			var file_frame;
			window.inputWrapper = '';
		},
	}

	var addButton = $("#repeater").find('.repeater-add-btn');

	addButton.on("click", function () {
		var repeater_field_count = $("input[name=repeater-field-count]").val();
		var item = $('#item-0').clone().prop("id", "item-" + repeater_field_count);
		item.appendTo("#repeater");
		var newItem = $('#item-' + repeater_field_count);
		var input = newItem.find('input,select');
		input.each(function (index, el) {
			var clonedElement = newItem.find(el);
			var attrName = clonedElement.data('name');
			console.log(attrName);
			if( attrName == '[font-weight-0]' ) {
				clonedElement.attr("name", 'bsf_custom_fonts[font-weight-' + ( parseInt( repeater_field_count ) + 1 ) + ']');
			}
			if( attrName == '[font_woff_2-0]' ) {
				clonedElement.attr("name", 'bsf_custom_fonts[font_woff_2-' + ( parseInt( repeater_field_count ) + 1 ) + ']');
			}
			if( attrName == '[font_woff-0]' ) {
				clonedElement.attr("name", 'bsf_custom_fonts[font_woff-' + ( parseInt( repeater_field_count ) + 1 ) + ']');
			}
			if( attrName == '[font_ttf-0]' ) {
				clonedElement.attr("name", 'bsf_custom_fonts[font_ttf-' + ( parseInt( repeater_field_count ) + 1 ) + ']');
			}
			if( attrName == '[font_eot-0]' ) {
				clonedElement.attr("name", 'bsf_custom_fonts[font_eot-' + ( parseInt( repeater_field_count ) + 1 ) + ']');
			}
			if( attrName == '[font_svg-0]' ) {
				clonedElement.attr("name", 'bsf_custom_fonts[font_svg-' + ( parseInt( repeater_field_count ) + 1 ) + ']');
			}
			if( attrName == '[font_otf-0]' ) {
				clonedElement.attr("name", 'bsf_custom_fonts[font_otf-' + ( parseInt( repeater_field_count ) + 1 ) + ']');
			}
		});
		$("input[name=repeater-field-count]").val( parseInt( repeater_field_count ) + 1 );
	});

	var editAddButton = $("#repeater").find('.edit-repeater-add-btn');

	editAddButton.on("click", function () {
		var repeater_field_count = $("input[name=repeater-field-count]").val();
		var item = $('#repeater .items').first().clone().prop("id", "item-" + ( parseInt( repeater_field_count ) ) );
		item.appendTo("#repeater");
		var newItem = $("#item-" + repeater_field_count);
		var newItemId = $('#repeater .items').first().find('select').attr('id').replace( /^\D+/g, '');
		var input = newItem.find('input,select');
		input.each(function (index, el) {
			var clonedElement = newItem.find(el);
			var attrName = clonedElement.attr('name');
			if( attrName == 'bsf_custom_fonts[font-weight-' + newItemId + ']' ) {
				clonedElement.attr("name", 'bsf_custom_fonts[font-weight-' + ( parseInt( repeater_field_count ) ) + ']');
			}
			if( attrName == 'bsf_custom_fonts[font_woff_2-' + newItemId + ']' ) {
				clonedElement.attr("name", 'bsf_custom_fonts[font_woff_2-' + ( parseInt( repeater_field_count ) ) + ']');
				clonedElement.attr("value", '');
			}
			if( attrName == 'bsf_custom_fonts[font_woff-' + newItemId + ']' ) {
				clonedElement.attr("name", 'bsf_custom_fonts[font_woff-' + ( parseInt( repeater_field_count ) ) + ']');
				clonedElement.attr("value", '');
			}
			if( attrName == 'bsf_custom_fonts[font_ttf-' + newItemId + ']' ) {
				clonedElement.attr("name", 'bsf_custom_fonts[font_ttf-' + ( parseInt( repeater_field_count ) ) + ']');
				clonedElement.attr("value", '');
			}
			if( attrName == 'bsf_custom_fonts[font_eot-' + newItemId + ']' ) {
				clonedElement.attr("name", 'bsf_custom_fonts[font_eot-' + ( parseInt( repeater_field_count ) ) + ']');
				clonedElement.attr("value", '');
			}
			if( attrName == 'bsf_custom_fonts[font_svg-' + newItemId + ']' ) {
				clonedElement.attr("name", 'bsf_custom_fonts[font_svg-' + ( parseInt( repeater_field_count ) ) + ']');
				clonedElement.attr("value", '');
			}
			if( attrName == 'bsf_custom_fonts[font_otf-' + newItemId + ']' ) {
				clonedElement.attr("name", 'bsf_custom_fonts[font_otf-' + ( parseInt( repeater_field_count ) ) + ']');
				clonedElement.attr("value", '');
			}
		});
		$("input[name=repeater-field-count]").val( parseInt( repeater_field_count ) + 1 );
		$('html, body').animate({
			scrollTop: newItem.offset().top
		}, 500);
	});

	/* Initializes the Bsf Custom Fonts. */
	$(function(){
		BsfCustomFonts.init();
	});

})(jQuery);
