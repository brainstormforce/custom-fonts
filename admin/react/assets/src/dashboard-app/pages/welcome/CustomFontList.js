import React from "react";
import ListItem from "./ListItem";
import { useSelector } from "react-redux";
import EmptyState from "./EmptyState";

const CustomFontList = () => {
	const fontsData = useSelector((state) => state.fonts);
	const fontPostCount = bsf_custom_fonts_admin.fontPostCount;

	if ( 0 == fontPostCount ) {
		return <EmptyState/>
	}

	return (
		<div className="border border-light bcf-font-list-wrap">
			{
				fontsData && fontsData.map((item, key) => (
					<ListItem item={item} key={key} />
				))
			}
		</div>
	);
};

export default CustomFontList;
