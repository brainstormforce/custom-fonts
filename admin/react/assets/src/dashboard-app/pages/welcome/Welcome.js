import { useState } from "react";
import CustomFontGrid from "./CustomFontGrid";
import CustomFontList from "./CustomFontList";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";

const Welcome = () => {
	const [activeView, setActiveView] = useState("list");

	const toggleView = (value) => {
		setActiveView(value);
	};
	return (
		<div className="">
			<div className="bg-white border-b border-slate-200">
				<div className="max-w-3xl mx-auto px-3 sm:px-6 lg:max-w-full">
					<div className="relative py-7">
						<div className="flex flex-col lg:flex-row justify-between items-start">
							<div>
								<h2 className="text-[1.625rem] font-semibold mb-3.5">
									Custom Fonts
								</h2>
								<p className="text-xs">
									Manage fonts that are used on your website
								</p>
							</div>
							<div className="relative">
								<Link
									to={{
										pathname: "admin.php",
										search: `?page=bsf-custom-fonts&path=add-fonts`,
									}}
									className="flex text-sm text-white bg-primary px-3 py-2"
								>
									Add New Font
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="max-w-3xl mx-auto px-3 sm:px-6 lg:max-w-full">
				{/* Search Custom Font */}
				<SearchBar />
				{/* Font Counter and View toggle */}
				<div className="flex justify-between items-center my-6">
					<div className="text-base">1 font family</div>
					<div className="flex justify-end gap-x-7">
						<div
							className="cursor-pointer"
							onClick={() => toggleView("list")}
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 20 20"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M2 4.75C2 4.33579 2.33579 4 2.75 4H17.25C17.6642 4 18 4.33579 18 4.75C18 5.16421 17.6642 5.5 17.25 5.5H2.75C2.33579 5.5 2 5.16421 2 4.75ZM2 10C2 9.58579 2.33579 9.25 2.75 9.25H17.25C17.6642 9.25 18 9.58579 18 10C18 10.4142 17.6642 10.75 17.25 10.75H2.75C2.33579 10.75 2 10.4142 2 10ZM2 15.25C2 14.8358 2.33579 14.5 2.75 14.5H17.25C17.6642 14.5 18 14.8358 18 15.25C18 15.6642 17.6642 16 17.25 16H2.75C2.33579 16 2 15.6642 2 15.25Z"
									fill={
										activeView === "list"
											? "#1D2327"
											: "#DDDDDD"
									}
								/>
							</svg>
						</div>
						<div
							className="cursor-pointer"
							onClick={() => toggleView("grid")}
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 20 20"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M4.25 2C3.00736 2 2 3.00736 2 4.25V6.75C2 7.99264 3.00736 9 4.25 9H6.75C7.99264 9 9 7.99264 9 6.75V4.25C9 3.00736 7.99264 2 6.75 2H4.25ZM4.25 11C3.00736 11 2 12.0074 2 13.25V15.75C2 16.9926 3.00736 18 4.25 18H6.75C7.99264 18 9 16.9926 9 15.75V13.25C9 12.0074 7.99264 11 6.75 11H4.25ZM13.25 2C12.0074 2 11 3.00736 11 4.25V6.75C11 7.99264 12.0074 9 13.25 9H15.75C16.9926 9 18 7.99264 18 6.75V4.25C18 3.00736 16.9926 2 15.75 2H13.25ZM13.25 11C12.0074 11 11 12.0074 11 13.25V15.75C11 16.9926 12.0074 18 13.25 18H15.75C16.9926 18 18 16.9926 18 15.75V13.25C18 12.0074 16.9926 11 15.75 11H13.25Z"
									fill={
										activeView === "grid"
											? "#1D2327"
											: "#DDDDDD"
									}
								/>
							</svg>
						</div>
					</div>
				</div>
				{/* Font Listing Components */}
				{activeView === "grid" && <CustomFontGrid />}
				{activeView === "list" && <CustomFontList />}
				<div className="mt-6 text-center">
					<button className="button">Add New Font</button>
				</div>
			</div>
		</div>
	);
};

export default Welcome;
