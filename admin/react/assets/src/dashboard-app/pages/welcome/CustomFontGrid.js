import React from "react";
import { __ } from "@wordpress/i18n";

const CustomFontGrid = () => {
	return (
		<div className="border border-light grid grid-cols-3 divide-x divide-y divide-outline">
			{/* Grid Item */}
			{[1, 2, 3, 4].map((font) => (
				<div className="p-6" key={font}>
					<div className="flex justify-between items-center">
						<div className="text-neutral">Variable</div>
						<div className="">
							<a href="" className="text-danger">
								{ __( 'Remove', 'custom-fonts' ) }
							</a>
						</div>
					</div>
					<div className="mt-6">
						<h1 className="text-5xl">Satoshi</h1>
					</div>
				</div>
			))}
		</div>
	);
};

export default CustomFontGrid;
