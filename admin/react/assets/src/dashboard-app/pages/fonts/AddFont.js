import React, { useState } from "react";
import LocalFont from "./LocalFont";
import GoogleFont from "./GoogleFont";
import { Link } from "react-router-dom";
import { RangeControl } from "@wordpress/components";
import GooglePreviewItem from "./preview/GooglePreviewItem";
import LocalPreviewItem from "./preview/LocalPreviewItem";
import FontNotification from "./FontNotification";

const AddFont = () => {
	const [activeType, setActiveType] = useState("local");

	const toggleType = (value) => {
		setActiveType(value);
	};
	return (
		<div>
			<div className="grid grid-cols-12">
				<div className="col-span-3 px-6 bg-white min-h-screen">
					{/* Here will be Nav Section */}
					<div className="flex items-center mb-5 border-b border-light">
						<Link
							to={{
								pathname: "admin.php",
								search: `?page=bsf-custom-fonts`,
							}}
							className="mr-4 cursor-pointer"
						>
							<svg
								width="8"
								height="12"
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
							className={`text-base hover:text-heading cursor-pointer px-4 pt-6 pb-5 border-b-2 border-white hover:border-b-primary ${
								activeType === "local"
									? "text-heading border-b-primary"
									: "text-neutral"
							}`}
						>
							Local Fonts
						</div>
						<div
							onClick={() => toggleType("google")}
							className={`text-base hover:text-heading cursor-pointer px-4 pt-6 pb-5 border-b-2 border-white hover:border-b-primary ${
								activeType === "google"
									? "text-heading border-b-primary"
									: "text-neutral"
							}`}
						>
							Google Fonts
						</div>
					</div>
					<div>
						{activeType === "local" && <LocalFont />}
						{activeType === "google" && <GoogleFont />}
					</div>
				</div>
				<div className="col-span-9 pt-6 pb-5 px-6">
					{/* Here will be Font Preview Section */}
					<div className="border-b border-light pb-5 flex justify-between items-center">
						<div className="text-sm text-secondary">
							Font preview
						</div>
						<div className="w-[314px]">
							<RangeControl />
						</div>
					</div>
					<div className="py-5 divide-y">
						<div className="text-sm text-neutral py-5">
							<p>
								Font preview will appear here. Please select a
								font file.
							</p>
						</div>
						<div>
							{activeType === "local" && <LocalPreviewItem />}
							{activeType === "google" && <GooglePreviewItem />}
						</div>
					</div>
				</div>
			</div>
			<FontNotification />
		</div>
	);
};

export default AddFont;
