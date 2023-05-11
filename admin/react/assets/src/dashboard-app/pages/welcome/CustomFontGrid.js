import React from "react";
import { __ } from "@wordpress/i18n";
import GridItem from './GridItem';
import { useSelector } from 'react-redux';

const CustomFontGrid = () => {
	const fontsData = useSelector( ( state ) => state.fonts );

	return (
		<div className="border border-light grid grid-cols-3 bcf-font-grid-wrap">
			{
				fontsData && fontsData.map(( item, key ) => (
					<GridItem item={item} key={key} />
				))
			}
		</div>
	);
};

export default CustomFontGrid;
