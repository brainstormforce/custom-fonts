import React from "react";
import ListItem from "./ListItem";
import { useSelector } from "react-redux";
import EmptyState from "./EmptyState";
import ListSkeleton from "../../SkeletonSkins";

const CustomFontList = () => {
	const fontsData = useSelector((state) => state.fonts);

	if ( fontsData && fontsData.length === 0 ) {
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
