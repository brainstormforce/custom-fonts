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

	var items = $("#repeater").find(".items");
	var key = 0;
	var addButton = $("#repeater").find('.repeater-add-btn');

	var addItem = function (items, key, fresh = true) {
		console.log('inn');
		var itemContent = items;
		var item = itemContent;
		var input = item.find('input,select');
		input.each(function (index, el) {
			var attrName = $(el).data('name');
			var skipName = $(el).data('skip-name');
			if (skipName != true) {
				if( attrName == '[font-weight]' ) {
					$(el).attr("name", 'bsf_custom_fonts[repeater_fields]'+ "[" + key +"]"+ attrName);
				}
				else{
					$(el).attr("name", 'bsf_custom_fonts' + "[repeater_fields][" + key +"]"+     attrName);
				}
			} else {
				if (attrName != 'undefined') {
					$(el).attr("name", attrName);
				}
			}
			if (fresh == true) {
				$(el).attr('value', '');
			}
		})
		var itemClone = items;

		/* Handling remove btn */
		var removeButton = itemClone.find('.remove-btn');

		if (key == 0) {
			removeButton.attr('disabled', true);
		} else {
			removeButton.attr('disabled', false);
		}

		$("<div class='items'>" + itemClone.html() + "<div/>").insertBefore('.repeater-heading');

		removeButton.attr('onclick', '(function($){ console.log($(this).before()); $(this).parents().remove()})(jQuery);');


		// var data_sbw = $("<div class='items'>" + itemClone.html() + "<div/>");

		// repeater.html(data_sbw);

	};

	addButton.on("click", function () {
		addItem($(items[0]), key);
		key++;
	});

	/* Initializes the Bsf Custom Fonts. */
		$(function(){
			BsfCustomFonts.init();
			// $("#repeater").createRepeater({
		    //     showFirstItemToDefault: true,
			// });
			// $( "#repeater" ).click(function() {
			// 	alert( "Handler for .click() called." );
			// });
		});

})(jQuery);
