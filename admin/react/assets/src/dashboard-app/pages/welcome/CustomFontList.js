import React from "react";

const CustomFontList = () => {
	return (
		<div className="border border-outline">
			{/* List Item */}
			<div className="flex items-center justify-between p-5">
				<div className="flex items-center">
					<h1 className="text-xl">Satoshi</h1>
					<div className="ml-3 text-sm">(3 variants)</div>
				</div>
				<div className="flex">
					<a href="" className="text-danger">Remove</a>
					<div className="ml-11">
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
								d="M5.23017 7.20938C5.52875 6.92228 6.00353 6.93159 6.29063 7.23017L10 11.1679L13.7094 7.23017C13.9965 6.93159 14.4713 6.92228 14.7698 7.20938C15.0684 7.49647 15.0777 7.97125 14.7906 8.26983L10.5406 12.7698C10.3992 12.9169 10.204 13 10 13C9.79599 13 9.60078 12.9169 9.45938 12.7698L5.20938 8.26983C4.92228 7.97125 4.93159 7.49647 5.23017 7.20938Z"
								fill="#7E7E7E"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CustomFontList;
