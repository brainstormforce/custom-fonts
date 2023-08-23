import { __ } from "@wordpress/i18n";
import React from "react";
import Custom_Fonts_Icons from "@Common/svg-icons";

const EmptyState = () => {
	return (
		<div className="inline text-center">
			<span className="text-center mb-6">
				{Custom_Fonts_Icons["play"]}
			</span>
			<h3 className="text-base font-semibold mt-6 mb-1">
				{__('Find your fonts here', 'custom-fonts')}
			</h3>
			<p className="text-sm mb-6">
				{ __( 'Once you have add fonts, come back here to find them again easily.', 'custom-fonts' ) }
			</p>
		</div>
	);
};

export default EmptyState;
