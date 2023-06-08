import React from "react";
import ListItem from "./ListItem";
import { useSelector } from "react-redux";
import SkeletonSkins from "../../SkeletonSkins";

const CustomFontList = ({ searchResults, loading, activeView }) => {
	const fontsData = useSelector((state) => state.fonts);
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
