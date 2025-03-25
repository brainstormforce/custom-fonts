import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import { Switch } from "@headlessui/react";
import apiFetch from "@wordpress/api-fetch";
import { useSelector, useDispatch } from "react-redux";

const Settings = () => {
	const preloading = useSelector((state) => state.optionPreload);
	const [isChecked, updateCheck] = useState("1" === preloading || true === preloading ? true : false);
	const [isTrackingEnabled, setIsTrackingEnabled] = useState(false);
	const dispatch = useDispatch();

	// Fetch the initial tracking state.
	useEffect(() => {
		apiFetch({
			path: "/wp/v2/settings", // Use the REST API to get the setting value.
		})
			.then((response) => {
				setIsTrackingEnabled(response?.bsf_analytics_optin === "1"); // Set initial state.
			})
			.catch((error) => {
				console.error("Error fetching tracking state:", error);
			});
	}, []);

	const preloadingUpdate = () => {
		updateCheck(!isChecked);
		const formData = new window.FormData();
		formData.append("action", "bcf_preloading");
		formData.append("security", bsf_custom_fonts_admin.preload_font_nonce);
		formData.append("isPreloading", !isChecked);

		apiFetch({
			url: bsf_custom_fonts_admin.ajax_url,
			method: "POST",
			body: formData,
		})
			.then((response) => {
				if (response.success) {
					dispatch({
						type: "UPDATE_PRELOADING",
						payload: !isChecked,
					});
				}
			})
			.catch((error) => {
				console.error("Error during API request:", error);
				dispatch({
					type: "API_REQUEST_FAILED",
					payload: error.message || "An error occurred. Please try again.",
				});
			});
	};

	// Update tracking setting.
	const trackingUpdate = () => {
		const updatedValue = !isTrackingEnabled ? "1" : "0";

		apiFetch({
			path: "/wp/v2/settings",
			method: "POST",
			data: {
				bsf_analytics_optin: updatedValue,
			},
		})
			.then(() => {
				setIsTrackingEnabled(!isTrackingEnabled);
			})
			.catch((error) => {
				console.error("Error updating tracking state:", error);
			});
	};

	const classNames = (...classes) => {
		return classes.filter(Boolean).join(" ");
	};

	return (
		<div>
			<p className="font-semibold text-base leading-6 mr-[-20px]">
				{__("Global Settings", "custom-fonts")}
			</p>
			<div className="flex flex-col items-start gap-6 rounded-sm mt-[20px]">
				{/* Preload Fonts Switch */}
				<label className="flex items-center gap-1.5 cursor-pointer relative">
					<Switch.Group as="div" className="flex items-center">
						<Switch
							checked={isChecked}
							onChange={preloadingUpdate}
							className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none"
						>
							<span className="sr-only">Use setting</span>
							<span
								aria-hidden="true"
								className={classNames(
									isChecked ? "bg-[#3858e9]" : "bg-gray-200",
									"pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out"
								)}
							/>
							<span
								aria-hidden="true"
								className={classNames(
									isChecked ? "translate-x-5" : "translate-x-0",
									"pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out"
								)}
							/>
						</Switch>
						<Switch.Label as="span" className="ml-3 text-sm switch-toggle-label">
							<span className="text-gray-900 text-base font-normal ml-2">
								{__("Preload Fonts", "custom-fonts")}
							</span>
						</Switch.Label>
					</Switch.Group>
				</label>

				{/* Disable Tracking Switch */}
				<label className="flex items-center gap-1.5 cursor-pointer relative">
					<Switch.Group as="div" className="flex items-center">
						<Switch
							checked={isTrackingEnabled}
							onChange={trackingUpdate}
							className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none"
						>
							<span className="sr-only">Use setting</span>
							<span
								aria-hidden="true"
								className={classNames(
									isTrackingEnabled ? "bg-[#3858e9]" : "bg-gray-200",
									"pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out"
								)}
							/>
							<span
								aria-hidden="true"
								className={classNames(
									isTrackingEnabled ? "translate-x-5" : "translate-x-0",
									"pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out"
								)}
							/>
						</Switch>
						<Switch.Label as="span" className="ml-3 text-sm switch-toggle-label">
							<span className="text-gray-900 text-base font-normal ml-2">
								{__("Disable Tracking", "custom-fonts")}
							</span>
						</Switch.Label>
					</Switch.Group>
				</label>
			</div>
		</div>
	);
};

export default Settings;
