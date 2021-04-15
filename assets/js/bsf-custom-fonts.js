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

	function remove_button_disable(){
		if (1 === $('.repeater-remove-btn .remove-btn').length ){
			$('.repeater-remove-btn .remove-btn').addClass('disabled');
		}else{
			$('.repeater-remove-btn .remove-btn').removeClass('disabled');
		}
	}

	var addButton = $('.repeater-add-btn:last');

	addButton.on('click', function () {
		var repeaterFieldCount = $('input[name=repeater-field-count]').val();
		var item = $('#repeater .cf-bsf-items').first().clone().prop('id', 'item-' + ( parseInt( repeaterFieldCount ) ) );

		item.appendTo('#repeater');
		var newItem = $('#item-' + parseInt( repeaterFieldCount ) );
		var input = newItem.find('input,select');
		input.each(function (index, el) {
			var clonedElement = newItem.find(el);
			var attrName = clonedElement.data('name');
			if( attrName == '[font-weight-0]' ) {
				clonedElement.attr('name', 'bsf_custom_fonts[font-weight-' + ( parseInt( repeaterFieldCount ) ) + ']');
			}
			if( attrName == '[font_woff_2-0]' ) {
				clonedElement.attr('name', 'bsf_custom_fonts[font_woff_2-' + ( parseInt( repeaterFieldCount ) ) + ']');
				clonedElement.attr('value', '');
			}
			if( attrName == '[font_woff-0]' ) {
				clonedElement.attr('name', 'bsf_custom_fonts[font_woff-' + ( parseInt( repeaterFieldCount ) ) + ']');
				clonedElement.attr('value', '');
			}
			if( attrName == '[font_ttf-0]' ) {
				clonedElement.attr('name', 'bsf_custom_fonts[font_ttf-' + ( parseInt( repeaterFieldCount ) ) + ']');
				clonedElement.attr('value', '');
			}
			if( attrName == '[font_eot-0]' ) {
				clonedElement.attr('name', 'bsf_custom_fonts[font_eot-' + ( parseInt( repeaterFieldCount ) ) + ']');
				clonedElement.attr('value', '');
			}
			if( attrName == '[font_svg-0]' ) {
				clonedElement.attr('name', 'bsf_custom_fonts[font_svg-' + ( parseInt( repeaterFieldCount ) ) + ']');
				clonedElement.attr('value', '');
			}
			if( attrName == '[font_otf-0]' ) {
				clonedElement.attr('name', 'bsf_custom_fonts[font_otf-' + ( parseInt( repeaterFieldCount ) ) + ']');
				clonedElement.attr('value', '');
			}
		});
		$('input[name=repeater-field-count]').val( parseInt( repeaterFieldCount ) + 1 );

		remove_button_disable();
		$('html, body').animate({
			scrollTop: newItem.offset().top
		}, 500);
	});

	var editAddButton = $('.edit-repeater-add-btn:last');

	editAddButton.on('click', function () {
		var repeaterFieldCount = $('input[name=repeater-field-count]').val();
		var item = $('#repeater .cf-bsf-items').first().clone().prop('id', 'item-' + ( parseInt( repeaterFieldCount ) ) );
		item.appendTo('#repeater');
		var newItem = $('#item-' + repeaterFieldCount);
		var newItemId = $('#repeater .cf-bsf-items').first().find('select').attr('id').replace( /^\D+/g, '');
		var input = newItem.find('input,select');
		input.each(function (index, el) {
			var clonedElement = newItem.find(el);
			var attrName = clonedElement.attr('name');
			if( attrName == 'bsf_custom_fonts[font-weight-' + newItemId + ']' ) {
				clonedElement.attr('name', 'bsf_custom_fonts[font-weight-' + ( parseInt( repeaterFieldCount ) ) + ']');
			}
			if( attrName == 'bsf_custom_fonts[font_woff_2-' + newItemId + ']' ) {
				clonedElement.attr('name', 'bsf_custom_fonts[font_woff_2-' + ( parseInt( repeaterFieldCount ) ) + ']');
				clonedElement.attr('value', '');
			}
			if( attrName == 'bsf_custom_fonts[font_woff-' + newItemId + ']' ) {
				clonedElement.attr('name', 'bsf_custom_fonts[font_woff-' + ( parseInt( repeaterFieldCount ) ) + ']');
				clonedElement.attr('value', '');
			}
			if( attrName == 'bsf_custom_fonts[font_ttf-' + newItemId + ']' ) {
				clonedElement.attr('name', 'bsf_custom_fonts[font_ttf-' + ( parseInt( repeaterFieldCount ) ) + ']');
				clonedElement.attr('value', '');
			}
			if( attrName == 'bsf_custom_fonts[font_eot-' + newItemId + ']' ) {
				clonedElement.attr('name', 'bsf_custom_fonts[font_eot-' + ( parseInt( repeaterFieldCount ) ) + ']');
				clonedElement.attr('value', '');
			}
			if( attrName == 'bsf_custom_fonts[font_svg-' + newItemId + ']' ) {
				clonedElement.attr('name', 'bsf_custom_fonts[font_svg-' + ( parseInt( repeaterFieldCount ) ) + ']');
				clonedElement.attr('value', '');
			}
			if( attrName == 'bsf_custom_fonts[font_otf-' + newItemId + ']' ) {
				clonedElement.attr('name', 'bsf_custom_fonts[font_otf-' + ( parseInt( repeaterFieldCount ) ) + ']');
				clonedElement.attr('value', '');
			}
		});
		$('input[name=repeater-field-count]').val( parseInt( repeaterFieldCount ) + 1 );

		remove_button_disable();
		$('html, body').animate({
			scrollTop: newItem.offset().top
		}, 500);
	});

	$(document).on('click', '.remove-btn', function () {
		$this = $(this)
		if ( $this.hasClass( 'disabled' ) ) {
			return false;
		}
		$this.parents('.cf-bsf-items').remove();
		remove_button_disable();
	});

	$( document ).ajaxComplete(function( event, request, settings ) {
		if( settings.data && "action=add-tag" === settings.data.split("&")[0]){
			location.reload();
		}
	  });

	/* Initializes the Bsf Custom Fonts. */
	$(function(){
		BsfCustomFonts.init();
		remove_button_disable();
	});

})(jQuery);
