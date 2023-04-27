import React, { useState } from "react";

const VariationItem = ({
	variation,
	localDataLength,
	handleVariationRemove,
	handleVariationChange,
}) => {
	const [toggleView, setToggleView] = useState(true);

	return (
		<div className="border border-light rounded-sm">
			{!toggleView ? (
				<div className="flex items-center justify-between p-3.5">
					<h2 className="text-sm font-semibold text-secondary">
						Satoshi-Regular.otf
					</h2>
					<div className="flex items-center justify-end gap-x-4">
						<svg
							onClick={() => setToggleView(true)}
							width="12"
							height="8"
							viewBox="0 0 12 8"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M2.00039 0.800049L6.00039 4.80005L10.0004 0.800049L11.6004 1.60005L6.00039 7.20005L0.400391 1.60005L2.00039 0.800049Z"
								fill="#7E7E7E"
							/>
						</svg>

						{localDataLength > 1 && (
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="cursor-pointer"
								onClick={() =>
									handleVariationRemove(variation.id)
								}
							>
								<path
									d="M8.00078 0.800049C4.00078 0.800049 0.800781 4.00005 0.800781 8.00005C0.800781 12 4.00078 15.2 8.00078 15.2C12.0008 15.2 15.2008 12 15.2008 8.00005C15.2008 4.00005 12.0008 0.800049 8.00078 0.800049ZM8.00078 13.6C4.88078 13.6 2.40078 11.12 2.40078 8.00005C2.40078 4.88005 4.88078 2.40005 8.00078 2.40005C11.1208 2.40005 13.6008 4.88005 13.6008 8.00005C13.6008 11.12 11.1208 13.6 8.00078 13.6ZM4.80078 7.20005V8.80005H11.2008V7.20005H4.80078Z"
									fill="#007CBA"
								/>
							</svg>
						)}
					</div>
				</div>
			) : (
				<div className="relative p-4 bg-theme-bg">
					<div className="mb-3">
						<div className="flex items-center gap-x-4">
							<input
								type="file"
								name={`variation-${variation.id}-font_file`}
								value={variation.font_file}
								className="border-0"
								onChange={(event) =>
									handleVariationChange(
										event,
										variation.id,
										"font_file"
									)
								}
							/>
							<svg
								onClick={() => setToggleView(false)}
								width="12"
								height="8"
								viewBox="0 0 12 8"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M2.00039 7.19995L6.00039 3.19995L10.0004 7.19995L11.6004 6.39995L6.00039 0.799951L0.400391 6.39995L2.00039 7.19995Z"
									fill="#7E7E7E"
								/>
							</svg>
							{localDataLength > 1 && (
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="cursor-pointer"
									onClick={() =>
										handleVariationRemove(variation.id)
									}
								>
									<path
										d="M8.00078 0.800049C4.00078 0.800049 0.800781 4.00005 0.800781 8.00005C0.800781 12 4.00078 15.2 8.00078 15.2C12.0008 15.2 15.2008 12 15.2008 8.00005C15.2008 4.00005 12.0008 0.800049 8.00078 0.800049ZM8.00078 13.6C4.88078 13.6 2.40078 11.12 2.40078 8.00005C2.40078 4.88005 4.88078 2.40005 8.00078 2.40005C11.1208 2.40005 13.6008 4.88005 13.6008 8.00005C13.6008 11.12 11.1208 13.6 8.00078 13.6ZM4.80078 7.20005V8.80005H11.2008V7.20005H4.80078Z"
										fill="#007CBA"
									/>
								</svg>
							)}
						</div>

						<div className="text-xs text-neutral mt-1.5">
							.otf, .ttf, .woff, .woff2 file extensions supported
						</div>
					</div>
					<div className="grid grid-cols-2 gap-x-3">
						<div className="col-span-1">
							<label
								className="w-full text-sm text-heading"
								htmlFor=""
							>
								Font style:
							</label>
							<div className="mt-1.5">
								<select
									name={`variation-${variation.id}-font_style`}
									value={variation.font_style}
									onChange={(event) =>
										handleVariationChange(
											event,
											variation.id,
											"font_style"
										)
									}
									className="w-full"
								>
									<option value="normal">Normal</option>
								</select>
							</div>
						</div>
						<div className="col-span-1">
							<label
								className="w-full text-sm text-heading"
								htmlFor=""
							>
								Font weight:
							</label>
							<div className="mt-1.5">
								<input
									type="text"
									name={`variation-${variation.id}-font_weight`}
									value={variation.font_weight}
									onChange={(event) =>
										handleVariationChange(
											event,
											variation.id,
											"font_weight"
										)
									}
									className="w-full"
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

const LocalFont = () => {
	const [advanceTab, setAdvanceTab] = useState(false);
	const toggleAdvanceTab = () => {
		setAdvanceTab(!advanceTab);
	};
	const [localFontData, setLocalFontData] = useState({
		font_name: "",
		font_fallback: "",
		font_display: "",
		variations: [
			{
				id: 1,
				font_file: "",
				font_style: "",
				font_weight: "",
			},
		],
	});

	const handleInputChange = (event, property) => {
		const value = event.target.value;

		setLocalFontData((prevState) => ({
			...prevState,
			[property]: value,
		}));
	};

	const handleVariationChange = (event, id, property) => {
		const updatedVariations = localFontData.variations.map((variation) => {
			if (variation.id === id) {
				return {
					...variation,
					[property]: event.target.value,
				};
			} else {
				return variation;
			}
		});

		setLocalFontData({
			...localFontData,
			variations: updatedVariations,
		});
	};

	const addVariationOption = () => {
		const lastId =
			localFontData.variations[localFontData.variations.length - 1].id;
		const newId = lastId + 1;
		const newVariation = {
			id: newId,
			font_file: "",
			font_style: "",
			font_weight: "",
		};
		const updatedVariations = [...localFontData.variations, newVariation];

		setLocalFontData((prevState) => ({
			...prevState,
			variations: updatedVariations,
		}));
	};

	const handleVariationRemove = (id) => {
		const updatedVariations = localFontData.variations.filter(
			(variation) => variation.id !== id
		);

		setLocalFontData({
			...localFontData,
			variations: updatedVariations,
		});
	};

	return (
		<div>
			<div>
				<p className="mb-5">
					Add local fonts assets and font face definitions to your
					currently active theme
				</p>
				<div className="mb-5">
					<label className="w-full text-sm text-heading" htmlFor="">
						Font name
					</label>
					<div className="mt-1.5">
						<input
							name="font_name"
							value={localFontData.font_name}
							onChange={(event) =>
								handleInputChange(event, "font_name")
							}
							className="w-full"
							type="text"
						/>
					</div>
				</div>
				<div className="mb-5">
					<div
						onClick={toggleAdvanceTab}
						className="flex items-center px-1.5 gap-x-2"
					>
						<svg
							width="6"
							height="8"
							viewBox="0 0 6 8"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className={
								advanceTab
									? "rotate-90"
									: "" + "transition-transform duration-300"
							}
						>
							<path
								d="M0.400391 0.800049L5.20039 4.02405L0.400391 7.20005L0.400391 0.800049Z"
								fill="#007CBA"
							/>
						</svg>

						<label
							className="w-full text-sm text-heading"
							htmlFor=""
						>
							Advanced Options
						</label>
					</div>
					{advanceTab && (
						<div
							className={`transition-opacity duration-300 ease-in-out mt-3 ${
								advanceTab
									? "opacity-100 block"
									: "opacity-0 hidden"
							}`}
						>
							<div className="mb-3">
								<label
									className="w-full text-sm text-heading"
									htmlFor=""
								>
									Font fallback:
								</label>
								<div className="mt-1.5">
									<input
										className="w-full"
										type="text"
										name="font_fallback"
										value={localFontData.font_fallback}
										onChange={(event) =>
											handleInputChange(
												event,
												"font_fallback"
											)
										}
									/>
								</div>
								<span className="mt-1.5 text-xs text-neutral">
									Separate font names with comma(,). eg.
									Arial, Serif
								</span>
							</div>
							<div className="mb-5">
								<label
									className="w-full text-sm text-heading"
									htmlFor=""
								>
									Font display:
								</label>
								<div className="mt-1.5">
									<select
										className="w-full"
										name="font_display"
										value={localFontData.font_display}
										onChange={(event) =>
											handleInputChange(
												event,
												"font_display"
											)
										}
									>
										<option value="auto">auto</option>
									</select>
								</div>
							</div>
						</div>
					)}
				</div>
				{localFontData.variations.map((variation) => (
					<VariationItem
						variation={variation}
						localDataLength={localFontData.variations.length}
						handleVariationRemove={handleVariationRemove}
						handleVariationChange={handleVariationChange}
					/>
				))}

				<div
					className="flex items-center gap-x-1 my-5 cursor-pointer"
					onClick={addVariationOption}
				>
					<div>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M7.9998 0.800049C3.9998 0.800049 0.799805 4.00005 0.799805 8.00005C0.799805 12 3.9998 15.2 7.9998 15.2C11.9998 15.2 15.1998 12 15.1998 8.00005C15.1998 4.00005 11.9998 0.800049 7.9998 0.800049ZM7.9998 13.6C4.8798 13.6 2.3998 11.12 2.3998 8.00005C2.3998 4.88005 4.8798 2.40005 7.9998 2.40005C11.1198 2.40005 13.5998 4.88005 13.5998 8.00005C13.5998 11.12 11.1198 13.6 7.9998 13.6ZM8.7998 4.80005H7.1998V7.20005H4.7998V8.80005H7.1998V11.2H8.7998V8.80005H11.1998V7.20005H8.7998V4.80005Z"
								fill="#007CBA"
							/>
						</svg>
					</div>
					<div className="text-sm text-primary">
						Add Font Variation
					</div>
				</div>

				<button className="button button-primary my-5">
					Save Font
				</button>
			</div>
		</div>
	);
};

export default LocalFont;
