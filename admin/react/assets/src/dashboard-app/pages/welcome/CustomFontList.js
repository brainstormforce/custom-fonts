import React from "react";
import ListItem from "./ListItem";
import { useSelector } from "react-redux";

const CustomFontList = ({ searchResults }) => {
	const fontsData = useSelector((state) => state.fonts);
	return (
		<div className="border border-light bcf-font-list-wrap">
			{
				searchResults
				? searchResults.fonts &&
				  searchResults.fonts.map((item, key) => (
						<ListItem item={item} key={key} />
				  ))
				: fontsData &&
				  fontsData.map((item, key) => (
						<ListItem item={item} key={key} />
				  ))
			}
		</div>
	);
};

export default CustomFontList;
