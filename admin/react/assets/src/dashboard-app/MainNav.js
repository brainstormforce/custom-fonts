import { Link, useLocation } from "react-router-dom";
import { __ } from "@wordpress/i18n";
import { Fragment } from "react";

export default function MainNav() {
	let navMenus = [
		{
			name: __("Welcome", "astra"),
			slug: bsf_custom_fonts_admin.home_slug,
			path: "",
		},
		{
			name: __("Add Font", "astra"),
			slug: bsf_custom_fonts_admin.home_slug,
			path: "add-fonts",
		},
		{
			name: __("Free vs Pro", "astra"),
			slug: bsf_custom_fonts_admin.home_slug,
			path: "free-vs-pro",
		},
	];
	const menus = wp.hooks.applyFilters(
		"astra_dashboard.main_navigation",
		navMenus
	);

	const query = new URLSearchParams(useLocation()?.search);
	const activePage = query.get("page")
		? query.get("page")
		: bsf_custom_fonts_admin.home_slug;
	const activePath = query.get("path") ? query.get("path") : "";

	if (activePath === "spectra") {
		return <></>;
	}
	return (
		<div></div>
	);
}
