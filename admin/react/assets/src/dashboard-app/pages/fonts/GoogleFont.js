import React from "react";

const GoogleFont = () => {
	return (
		<div>
			<div>
				<p className="mb-5">
					Add Google fonts assets and font face definitions to your
					currently active theme
				</p>
				<div>
					<label className="w-full text-sm text-heading" htmlFor="">
						Select font
					</label>
					<div className="mt-1.5">
						<select className="w-full" name="" id="">
							<option value="">Select a font family...</option>
						</select>
					</div>
				</div>
				<div className="mt-5">
					<button className="button button-primary">Save Font</button>
				</div>
			</div>
		</div>
	);
};

export default GoogleFont;
