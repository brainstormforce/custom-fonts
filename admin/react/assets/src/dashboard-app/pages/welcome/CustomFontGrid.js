import React from "react";
import { __ } from "@wordpress/i18n";
import GridItem from "./GridItem";
import { useSelector } from "react-redux";
import SkeletonSkins from "../../SkeletonSkins";

const CustomFontGrid = ({ searchResults, loading, activeView }) => {
	const fontsData = useSelector((state) => state.fonts);
	if (loading) {
		return <SkeletonSkins activeView={activeView} count={8} />;
	}
	return (
		<div className="grid grid-cols-3 bcf-font-grid-wrap">
			{searchResults
				? searchResults.fonts &&
				  searchResults.fonts.map((item, key) => (
						<GridItem item={item} key={key} />
				  ))
				: fontsData &&
				  fontsData.map((item, key) => (
						<GridItem item={item} key={key} />
				  ))}
		</div>
	);
};

export default CustomFontGrid;
