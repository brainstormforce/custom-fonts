import React from "react";
import ListItem from './ListItem';
import { useSelector } from 'react-redux';

const CustomFontList = () => {
	const fontsData = useSelector( ( state ) => state.fonts );

	return (
		<div className="border border-light bcf-font-list-wrap">
			{
				fontsData && fontsData.map(( item, key ) => (
					<ListItem item={item} key={key} />
				))
			}
		</div>
	);
};

export default CustomFontList;
