import React from "react";
import ListItem from "./ListItem";
import { useSelector } from "react-redux";
import SkeletonSkins from "../../SkeletonSkins";
import EmptyState from "./EmptyState";

const CustomFontList = ({ searchResults, loading, activeView }) => {
	const fontsData = useSelector((state) => state.fonts);
	const fontPostCount = bsf_custom_fonts_admin.fontPostCount;

	if ( 0 == fontPostCount ) {
		return <EmptyState/>
	}

	if (loading) {
		return <SkeletonSkins activeView={activeView} count={8} />;
	}
	return (
		<div className="border border-light bcf-font-list-wrap">
			{searchResults
				? searchResults.fonts &&
				  searchResults.fonts.map((item, key) => (
						<ListItem item={item} key={key} />
				  ))
				: fontsData &&
				  fontsData.map((item, key) => (
						<ListItem item={item} key={key} />
				  ))}
		</div>
	);
};

export default CustomFontList;
