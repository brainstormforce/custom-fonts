import React, { useState, useRef, useEffect } from "react";
import CustomFontList from "./CustomFontList";
import { Link } from "react-router-dom";
import { __, _x } from "@wordpress/i18n";
import Settings from "./Settings";

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
				top: (parseInt( buttonRect.bottom ) - 30) + "px",
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
									{ _x( "Custom Fonts", "Page title", "custom-fonts" ) }
								</h2>
							</div>
							<div className="flex">
								<button
									id="cfSettingsButton" // Give the button an ID for positioning.
									className="mr-4 cursor-pointer py-0 px-0 focus:shadow-none focus:outline-none"
									onClick={handleToggleNewDiv}
								>
									<svg
										width="21"
										height="20"
										viewBox="0 0 21 20"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M18.5039 12H16.3239C16.1539 12.7 15.8839 13.35 15.5139 13.93L17.0539 15.47L14.9539 17.57L13.4139 16.03C12.8339 16.39 12.1839 16.66 11.5039 16.82V19H8.50391V16.82C7.82391 16.66 7.17391 16.39 6.59391 16.03L5.05391 17.57L2.93391 15.45L4.47391 13.91C4.11391 13.33 3.84391 12.68 3.68391 12H1.50391V9.03003H3.67391C3.83391 8.33003 4.11391 7.68003 4.47391 7.09003L2.93391 5.55003L5.03391 3.45003L6.57391 4.99003C7.15391 4.62003 7.81391 4.35003 8.50391 4.18003V2.00003H11.5039V4.18003C12.1839 4.34003 12.8339 4.61003 13.4139 4.97003L14.9539 3.43003L17.0739 5.55003L15.5339 7.09003C15.8939 7.68003 16.1739 8.33003 16.3339 9.03003H18.5039V12ZM10.0039 13.5C11.6639 13.5 13.0039 12.16 13.0039 10.5C13.0039 8.84003 11.6639 7.50003 10.0039 7.50003C8.34391 7.50003 7.00391 8.84003 7.00391 10.5C7.00391 12.16 8.34391 13.5 10.0039 13.5Z"
											fill="#3C434A"
										/>
									</svg>
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
						style={{ top: popupPosition.top, right: popupPosition.right }}
					>
						<Settings/>
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
						{ __("Add New Font", "custom-fonts") }
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Welcome;
