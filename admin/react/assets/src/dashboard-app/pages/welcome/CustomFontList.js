import React from "react";
import ListItem from "./ListItem";
import { useSelector } from "react-redux";
import EmptyState from "./EmptyState";
import ListSkeleton from "../../SkeletonSkins";

const CustomFontList = () => {
	const fontsData = useSelector((state) => state.fonts);
	const fontPostCount = bsf_custom_fonts_admin.fontPostCount;

	if ( 0 == fontPostCount ) {
		return <EmptyState/>
	}

	if ( null == fontsData ) {
		return <ListSkeleton />
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
