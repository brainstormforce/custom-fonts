import React, { useState, useEffect } from "react";
import { __, sprintf } from "@wordpress/i18n";
import { Switch } from "@headlessui/react";
import apiFetch from "@wordpress/api-fetch";
import { useSelector, useDispatch } from "react-redux";

const Settings = () => {
	const preloading = useSelector((state) => state.optionPreload);
	const [isPreloadingChecked, setPreloadingChecked] = useState(
		"1" === preloading || true === preloading
	);
	const [preloadFeedback, setPreloadFeedback] = useState(null);
	const dispatch = useDispatch();

	const [isTrackingChecked, setTrackingChecked] = useState(false);
	const [isMultisite, setIsMultisite] = useState(false);
	const [trackingFeedback, setTrackingFeedback] = useState(null);
	const [docLink, setDocLink] = useState(
		"https://store.brainstormforce.com/usage-tracking/"
	);
	const [isWhiteLabel, setIsWhiteLabel] = useState(false);

	const author = "Brainstorm Force";

	useEffect(() => {
		apiFetch({
			path: "/custom-fonts/v1/get-tracking-status",
		})
			.then((response) => {
				setTrackingChecked(response.status);
				setIsMultisite(response.is_multisite);
				setDocLink(response.usage_doc_link);
				setIsWhiteLabel(response.is_white_label);
			})
			.catch((error) => {
				console.error("Error fetching tracking status:", error);
			});
	}, []);

	const handlePreloadingChange = () => {
		const newValue = !isPreloadingChecked;
		setPreloadingChecked(newValue);
		setPreloadFeedback(null);

		const formData = new window.FormData();
		formData.append("action", "bcf_preloading");
		formData.append("security", bsf_custom_fonts_admin.preload_font_nonce);
		formData.append("isPreloading", newValue);

		apiFetch({
			url: bsf_custom_fonts_admin.ajax_url,
			method: "POST",
			body: formData,
		})
			.then((response) => {
				if (response.success) {
					dispatch({
						type: "UPDATE_PRELOADING",
						payload: newValue,
					});
					setPreloadFeedback({
						type: "success",
						message: newValue
							? __(
									"Font preloading enabled successfully.",
									"custom-fonts"
							  )
							: __(
									"Font preloading disabled successfully.",
									"custom-fonts"
							  ),
					});
				}
			})
			.catch((error) => {
				console.error("Error updating preloading:", error);
				setPreloadingChecked(!newValue);
				setPreloadFeedback({
					type: "error",
					message: __(
						"Failed to update preloading setting.",
						"custom-fonts"
					),
				});
			});
	};

	// Handle Usage Tracking toggle of bsf-analytics.
	const handleTrackingChange = (checked) => {
		setTrackingFeedback(null);

		apiFetch({
			path: "/custom-fonts/v1/update-tracking-status",
			method: "POST",
			data: { status: checked },
		})
			.then((response) => {
				if (response.success) {
					setTrackingChecked(checked);
					setTrackingFeedback({
						type: "success",
						message: checked
							? __(
									"Usage tracking enabled successfully.",
									"custom-fonts"
							  )
							: __(
									"Usage tracking disabled successfully.",
									"custom-fonts"
							  ),
					});
				} else {
					setTrackingFeedback({
						type: "error",
						message: response.message,
					});
					setTrackingChecked(!checked);
				}
			})
			.catch((error) => {
				setTrackingFeedback({
					type: "error",
					message:
						error.message || __("Update failed", "custom-fonts"),
				});
				setTrackingChecked(!checked);
			});
	};

	const classNames = (...classes) => {
		return classes.filter(Boolean).join(" ");
	};

	return (
		<div className="space-y-8">
			<p className="font-semibold text-base leading-6">
				{__("Global Settings", "custom-fonts")}
			</p>

			<div className="space-y-6">
				{/* Preload Fonts Toggle */}
				<div className="flex flex-col gap-2">
					<Switch.Group>
						<div className="flex items-center">
							<Switch
								checked={isPreloadingChecked}
								onChange={handlePreloadingChange}
								className={classNames(
									isPreloadingChecked
										? "bg-[#3858e9]"
										: "bg-gray-200",
									"relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
								)}
							>
								<span className="sr-only">
									{__("Preload Fonts", "custom-fonts")}
								</span>
								<span
									className={classNames(
										isPreloadingChecked
											? "translate-x-6"
											: "translate-x-1",
										"inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
									)}
								/>
							</Switch>
							<Switch.Label className="ml-3 text-base font-normal text-gray-900">
								{__("Preload Fonts", "custom-fonts")}
							</Switch.Label>
						</div>
					</Switch.Group>

					<p className="text-sm text-gray-600">
						{__(
							"Preloading your font file will speed up your website.",
							"custom-fonts"
						)}
					</p>

					{preloadFeedback && (
						<p
							className={`text-sm ${
								preloadFeedback.type === "success"
									? "text-green-600"
									: "text-red-600"
							}`}
						>
							{preloadFeedback.message}
						</p>
					)}
				</div>

                {/* Usage Tracking Toggle */}
				{!isWhiteLabel && (
					<div className="flex flex-col gap-2">
						<Switch.Group>
							<div className="flex items-center">
								<Switch
									checked={isTrackingChecked}
									onChange={handleTrackingChange}
									className={classNames(
										isTrackingChecked
											? "bg-[#3858e9]"
											: "bg-gray-200",
										"relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer"
									)}
								>
									<span className="sr-only">
										{__("Usage Tracking", "custom-fonts")}
									</span>
									<span
										className={classNames(
											isTrackingChecked
												? "translate-x-6"
												: "translate-x-1",
											"inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
										)}
									/>
								</Switch>
								<Switch.Label className="ml-3 text-base font-normal text-gray-900">
									{sprintf(
										__(
											"Allow %s to track usage data",
											"custom-fonts"
										),
										author
									)}
								</Switch.Label>
							</div>
						</Switch.Group>

						<p className="text-sm text-gray-600">
							{sprintf(
								__(
									"Allow %s products to track non-sensitive usage data.",
									"custom-fonts"
								),
								author
							)}
							<a
								href={docLink}
								target="_blank"
								rel="noopener noreferrer"
								className="text-[#3858e9] hover:underline"
							>
								{__("Learn more", "custom-fonts")}
							</a>
						</p>

						{isMultisite && (
							<p className="text-sm text-gray-600">
								{__(
									"This will be applicable for all sites from the network.",
									"custom-fonts"
								)}
							</p>
						)}

						{trackingFeedback && (
							<p
								className={`text-sm ${
									trackingFeedback.type === "success"
										? "text-green-600"
										: "text-red-600"
								}`}
							>
								{trackingFeedback.message}
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default Settings;
