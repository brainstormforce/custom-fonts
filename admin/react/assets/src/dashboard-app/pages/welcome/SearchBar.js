import { __ } from "@wordpress/i18n";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import apiFetch from "@wordpress/api-fetch";

const SearchBar = ({ setSearchResults }) => {
	const [query, setQuery] = useState("");
	const handleSearch = (e) => {
		const q = e.target.value;
		setQuery(q);
	};
	useEffect(() => {
		apiFetch({
			path: `/bsf-custom-fonts/v1/search?q=${query}`,
		}).then((results) => {
			if (results) {
				setSearchResults(results);
			}
		});
	}, [query]);
	return (
		<div className="relative w-full my-6 flex items-center border-b border-light bsf-custom-font-search">
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="mr-2"
			>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M6.19961 1.79998C3.76956 1.79998 1.79961 3.76992 1.79961 6.19998C1.79961 8.63003 3.76956 10.6 6.19961 10.6C7.4148 10.6 8.51398 10.1081 9.31088 9.31124C10.1078 8.51434 10.5996 7.41517 10.5996 6.19998C10.5996 3.76992 8.62966 1.79998 6.19961 1.79998ZM0.599609 6.19998C0.599609 3.10718 3.10681 0.599976 6.19961 0.599976C9.2924 0.599976 11.7996 3.10718 11.7996 6.19998C11.7996 7.52999 11.3354 8.75242 10.561 9.71283L13.2239 12.3757C13.4582 12.61 13.4582 12.9899 13.2239 13.2242C12.9896 13.4586 12.6097 13.4586 12.3753 13.2242L9.71246 10.5614C8.75206 11.3357 7.52963 11.8 6.19961 11.8C3.10681 11.8 0.599609 9.29277 0.599609 6.19998Z"
					fill="#7E7E7E"
				/>
			</svg>
			<input
				className="w-full border-0"
				type="text"
				placeholder={__("Search Custom Font", "custom-fonts")}
				onChange={handleSearch}
			/>
		</div>
	);
};

export default SearchBar;
