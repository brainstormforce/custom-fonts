import React, { useState, useRef, useEffect } from "react";
import CustomFontList from "./CustomFontList";
import { Link } from "react-router-dom";
import { __, _x } from "@wordpress/i18n";
import Settings from "./Settings";
import Custom_Fonts_Icons from "@Common/svg-icons";

const Welcome = () => {
	const [showNewDiv, setShowNewDiv] = useState(false);
	const popupRef = useRef(null);

	const handleToggleNewDiv = () => {
		setShowNewDiv((prev) => !prev);
	};

	// Close the popup when clicking outside.
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (popupRef.current && !popupRef.current.contains(event.target)) {
				setShowNewDiv(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Calculate the position of the popup relative to the button
	const calculatePopupPosition = () => {
		const buttonElement = document.getElementById("cfSettingsButton");
		if (buttonElement) {
			const buttonRect = buttonElement.getBoundingClientRect();
			return {
				top: parseInt(buttonRect.bottom) - 30 + "px",
				left: buttonRect.left,
			};
		}
		return { top: 0, left: 0 };
	};

	const popupPosition = calculatePopupPosition();

	return (
		<div className="">
			<div className="bg-white border-b border-slate-200">
				<div className="max-w-3xl mx-auto px-6 py-4 lg:max-w-full">
					<div className="relative py-0">
						<div className="flex iphone:flex-col lg:flex-row md:flex-row justify-between items-center">
							<div>
								<h2 className="text-base font-medium tablet:mb-3">
									{_x(
										"Custom Fonts",
										"Page title",
										"custom-fonts"
									)}
								</h2>
							</div>
							<div className="flex">
								<button
									id="cfSettingsButton" // Give the button an ID for positioning.
									className="mr-4 cursor-pointer py-0 px-0 focus:shadow-none focus:outline-none"
									onClick={handleToggleNewDiv}
								>
									{Custom_Fonts_Icons["preload_setting"]}
								</button>
								<Link
									to={{
										pathname: "themes.php",
										search: `?page=bsf-custom-fonts&path=add-fonts`,
									}}
									className="flex components-button is-secondary"
								>
									{__("Add New Font", "custom-fonts")}
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="max-w-3xl mx-auto px-6 py-6 lg:max-w-full">
				{/* Popup */}
				{showNewDiv && (
					<div
						ref={popupRef}
						className="absolute right-36 bg-white p-5 rounded border-solid border-[#ddd] border divide-y divide-gray-400 flex-col items-start gap-5 settings-popup"
						style={{
							top: popupPosition.top,
							right: popupPosition.right,
						}}
					>
						<Settings />
					</div>
				)}

				{/* Font Listing Components */}
				{<CustomFontList />}

				<div className="mt-6 text-center">
					<Link
						to={{
							pathname: "themes.php",
							search: `?page=bsf-custom-fonts&path=add-fonts`,
						}}
						className="components-button is-primary"
					>
						{__("Add New Font", "custom-fonts")}
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Welcome;
