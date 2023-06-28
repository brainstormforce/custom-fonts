import { __ } from "@wordpress/i18n";
import React from "react";

const EmptyState = () => {
	return (
		<div className="inline text-center">
			<span className="text-center mb-6">
				<svg className="my-0 mx-auto" width="65" height="64" viewBox="0 0 65 64" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="0.5" width="64" height="64" rx="32" fill="white"/>
					<path d="M19.5 34H24.6459C25.7822 34 26.821 34.642 27.3292 35.6584L27.6708 36.3416C28.179 37.358 29.2178 38 30.3541 38H34.6459C35.7822 38 36.821 37.358 37.3292 36.3416L37.6708 35.6584C38.179 34.642 39.2178 34 40.3541 34H45.5M19.5 34.4511V40C19.5 41.6569 20.8431 43 22.5 43H42.5C44.1569 43 45.5 41.6569 45.5 40V34.4511C45.5 34.152 45.4553 33.8547 45.3673 33.5688L42.1516 23.1177C41.7643 21.859 40.6013 21 39.2843 21H25.7157C24.3987 21 23.2357 21.859 22.8484 23.1177L19.6327 33.5688C19.5447 33.8547 19.5 34.152 19.5 34.4511Z" stroke="#007CBA" strokeWidth={"2"} strokeLinecap="round" strokeLinejoin="round"/>
				</svg>
			</span>
			<h3 className="text-base font-semibold mt-6 mb-1">
				{ __( 'Find your fonts here', 'custom-fonts' ) }
			</h3>
			<p className="text-sm mb-6">
				{ __( 'Once you have add fonts, come back here to find them again easily.', 'custom-fonts' ) }
			</p>
		</div>
	);
};

export default EmptyState;
