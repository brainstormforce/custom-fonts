(function($){

	/**
	 * Bsf Custom Fonts 
	 *
	 * @class BsfCustomFonts
	 * @since 1.0.0
	 */
	var frame;

	BsfCustomFonts = {
		
		/**
		 * Initializes a Bsf Custom Fonts.
		 *
		 * @since 1.0
		 * @method init
		 */ 
		init: function()
		{
			// Init backgrounds.
			$( '.bsf-custom-fonts-upload' ).on( 'click', this._fileUploads );
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
			
				event.preventDefault();
				var button = $(this),
    				button_type = button.data('upload-type');
			    // If the media frame already exists, reopen it.
			    if ( frame ) {
			      frame.open();
			      return;
			    }

			     // Create a new media frame
			    frame = wp.media.frames.file_frame = wp.media({
			    	library: { 
				      type: 'woff, ttf, eot, svg' // limits the frame to show only images
				   },
			     	multiple: false  // Set to true to allow multiple files to be selected
			    });

			     // When an image is selected in the media frame...
    			frame.on( 'select', function() {
    				
    				 // Get media attachment details from the frame state
      				var attachment = frame.state().get('selection').first().toJSON();
      					button.prev('.bsf-custom-fonts-link.'+ button_type).val(attachment.url);
      			});
      			    // Finally, open the modal on click
    				frame.open();
		},
	}

	/* Initializes the Bsf Custom Fonts. */
	$(function(){
		BsfCustomFonts.init();
	});

})(jQuery);