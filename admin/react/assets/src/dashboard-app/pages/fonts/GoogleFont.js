import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { __ } from "@wordpress/i18n";

const GoogleFont = () => {
	const googleFonts = bsf_custom_fonts_admin.googleFonts;
	const dispatch = useDispatch();
	const [gFont, setGFont] = useState('');

	function handleGoogleFontChange( e ) {
		setGFont( e.target.value );

		const changeEvent = new CustomEvent( 'bcf:googleFontSelection:change', {
			bubbles: true,
			detail: { e, name: e.target.name, value: e.target.value },
		} );

		document.dispatchEvent( changeEvent );
		dispatch( { type: 'SET_GOOGLE_FONT', payload: {
			"font_name": e.target.value,
			"font_fallback": '',
			"font_display": '',
			"variations": []
		} } );
	}

	return (
		<div>
			<div>
				<p className="mb-5">
					{__('Add Google fonts assets and font face definitions to your currently active theme', 'custom-fonts')}
				</p>
				<div>
					<label className="w-full text-sm text-heading" htmlFor="">
						{__('Select font', 'custom-fonts')}
					</label>
					<div className="mt-1.5">
						<select
							className="w-full"
							name="bcf-google-font-selection"
							id="bcf-google-font-selection"
							value={gFont}
							onChange={handleGoogleFontChange}
						>
							<option value=''> {__('Select a font family...', 'custom-fonts')} </option>
							{Object.keys(googleFonts).map((key) => (
								<option value={key} key={key}>{key}</option>
							))}
						</select>
					</div>
				</div>
				<div className="my-5 border border-light rounded-sm p-3.5">
					<h3 className="text-sm font-semibold text-heading">
						{__('Selected Variants', 'custom-fonts')}
					</h3>
					<div className="mt-3.5 flex flex-col gap-y-3.5">
						<div className="flex items-center justify-between">
							<div className="text-sm text-heading">
								{__('Regular 400', 'custom-fonts')}
							</div>
							<div>
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M8.00078 0.800049C4.00078 0.800049 0.800781 4.00005 0.800781 8.00005C0.800781 12 4.00078 15.2 8.00078 15.2C12.0008 15.2 15.2008 12 15.2008 8.00005C15.2008 4.00005 12.0008 0.800049 8.00078 0.800049ZM8.00078 13.6C4.88078 13.6 2.40078 11.12 2.40078 8.00005C2.40078 4.88005 4.88078 2.40005 8.00078 2.40005C11.1208 2.40005 13.6008 4.88005 13.6008 8.00005C13.6008 11.12 11.1208 13.6 8.00078 13.6ZM4.80078 7.20005V8.80005H11.2008V7.20005H4.80078Z"
										fill="#007CBA"
									/>
								</svg>
							</div>
						</div>
					</div>
				</div>
				<div className="my-5">
					<button className="button button-primary"> {__('Save Font', 'custom-fonts')} </button>
				</div>
			</div>
		</div>
	);
};

export default GoogleFont;
