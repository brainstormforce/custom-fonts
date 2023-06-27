import React, { useState } from "react";
import LocalFont from "./LocalFont";
import GoogleFont from "./GoogleFont";
import { Link } from "react-router-dom";
import { RangeControl } from "@wordpress/components";
import GooglePreviewItem from "./preview/GooglePreviewItem";
import LocalPreviewItem from "./preview/LocalPreviewItem";
import { __ } from "@wordpress/i18n";

const AddFont = () => {
	const [activeType, setActiveType] = useState("local");
	const [previewSize, updatePreviewSize] = useState("30");

	const toggleType = (value) => {
		setActiveType(value);
	};

	return (
		<div>
			<div className="grid grid-cols-12">
				<style id={`bcf-fonts-preview-size-css`}> {`:root { --bsf-custom-font-size: ${previewSize}px }`} </style>
				<div className="col-span-3 tablet:col-span-5 mobile:col-span-12 px-6 bg-white md:min-h-screen lg:px-[2em]">
					{/* Here will be Nav Section */}
					<div className="flex items-center mb-5 border-b border-light">
						<Link
							to={{
								pathname: "themes.php",
								search: `?page=bsf-custom-fonts`,
							}}
							className="mr-4 cursor-pointer py-3 px-0 focus:shadow-none focus:outline-none"
						>
							<svg
								width="15"
								height="15"
								viewBox="0 0 8 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M7.2002 9.99985L3.2002 5.99985L7.20019 1.99985L6.40019 0.399853L0.800195 5.99985L6.4002 11.5999L7.2002 9.99985Z"
									fill="#7E7E7E"
								/>
							</svg>
						</Link>
						<div
							onClick={() => toggleType("local")}
							className={`text-base font-medium leading-8 hover:text-heading cursor-pointer px-4 py-4 border-b-2 border-white hover:border-b-primary ${
								activeType === "local"
									? "text-heading border-b-primary"
									: "text-neutral"
							}`}
						>
							{__('Local Fonts', 'custom-fonts')}
						</div>
						<div
							onClick={() => toggleType("google")}
							className={`text-base font-medium leading-8 hover:text-heading cursor-pointer px-4 py-4 border-b-2 border-white hover:border-b-primary ${
								activeType === "google"
									? "text-heading border-b-primary"
									: "text-neutral"
							}`}
						>
							{__('Google Fonts', 'custom-fonts')}
						</div>
					</div>
					<div>
						{activeType === "local" && <LocalFont />}
						{activeType === "google" && <GoogleFont />}
					</div>
				</div>
				<div className="col-span-9 tablet:col-span-7 mobile:col-span-12 pt-4 pb-5 px-6 lg:px-[2em]">
					{/* Here will be Font Preview Section */}
					<div className="pb-3 flex justify-between items-center tablet:block">
						<div className="text-base font-medium text-secondary">
							{__('Font Preview', 'custom-fonts')}
						</div>
						<div className="w-[314px]">
							<RangeControl
								className="bcf-font-size-range"
								onChange={(value) => updatePreviewSize(value)}
								min={1}
								max={100}
								step={1}
								value={parseInt(previewSize)}
							/>
						</div>
					</div>
					<div className="py-5 divide-y border-t border-light">
						<div className="text-sm text-neutral pb-5 preview-font-name">
							<p>
								{activeType === "local" && __('Font preview will appear here. Please select a font file.', 'custom-fonts')}
								{activeType === "google" && __('Font preview will appear here. Please select a font.', 'custom-fonts')}
							</p>
						</div>
						{activeType === "local" && <LocalPreviewItem />}
						{activeType === "google" && <GooglePreviewItem />}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddFont;
