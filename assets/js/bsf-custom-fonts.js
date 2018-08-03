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

	/* Initializes the Bsf Custom Fonts. */
	$(function(){
		BsfCustomFonts.init();
	});

})(jQuery);