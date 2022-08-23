document.body.addEventListener('mousedown', function () {
    let cust_font = document.getElementById('cst_font_data');
    let cstfont = null !== cust_font ? cust_font.cloneNode(true) : null;

	setTimeout( function() {

		let tabletPreview = document.getElementsByClassName('is-tablet-preview');
		let mobilePreview = document.getElementsByClassName('is-mobile-preview');

		if (0 !== tabletPreview.length || 0 !== mobilePreview.length) {
			let preview = tabletPreview[0] || mobilePreview[0];

				let iframe = preview.getElementsByTagName('iframe')[0];
				let iframeDocument = iframe.contentWindow.document || iframe.contentDocument;
                iframeDocument.head.appendChild( cstfont );

		}
	}, 1000);

});
