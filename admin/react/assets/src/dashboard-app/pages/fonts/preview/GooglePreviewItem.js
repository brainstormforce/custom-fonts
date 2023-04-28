import React from "react";

const GooglePreviewItem = () => {
	return (
		<div className="py-5">
			<div className="flex justify-between items-center">
				<div>
					{/* Variation Name */}
					<div className="text-sm text-neutral mb-3.5">
						Regular 400
					</div>
					{/* Variation Preview */}
					<div className="text-5xl">
						How vexingly quick daft zebras jump!
					</div>
				</div>
				<div>
					<button className="flex text-sm text-primary items-center py-2 px-3 border border-primary">
						<svg
							width="16"
							height="17"
							viewBox="0 0 16 17"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M8.00078 1.30005C4.00078 1.30005 0.800781 4.50005 0.800781 8.50005C0.800781 12.5 4.00078 15.7 8.00078 15.7C12.0008 15.7 15.2008 12.5 15.2008 8.50005C15.2008 4.50005 12.0008 1.30005 8.00078 1.30005ZM8.00078 14.1C4.88078 14.1 2.40078 11.62 2.40078 8.50005C2.40078 5.38005 4.88078 2.90005 8.00078 2.90005C11.1208 2.90005 13.6008 5.38005 13.6008 8.50005C13.6008 11.62 11.1208 14.1 8.00078 14.1ZM8.80078 5.30005H7.20078V7.70005H4.80078V9.30005H7.20078V11.7H8.80078V9.30005H11.2008V7.70005H8.80078V5.30005Z"
								fill="#007CBA"
							/>
						</svg>
						<span className="ml-2">Add</span>
					</button>
					{/* If font variation added then use this button */}
					{/* <button className="flex text-sm text-neutral items-center py-2 px-3 border border-neutral">
						<svg
							width="16"
							height="17"
							viewBox="0 0 16 17"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M8.00078 1.30005C4.00078 1.30005 0.800781 4.50005 0.800781 8.50005C0.800781 12.5 4.00078 15.7 8.00078 15.7C12.0008 15.7 15.2008 12.5 15.2008 8.50005C15.2008 4.50005 12.0008 1.30005 8.00078 1.30005ZM8.00078 14.1C4.88078 14.1 2.40078 11.62 2.40078 8.50005C2.40078 5.38005 4.88078 2.90005 8.00078 2.90005C11.1208 2.90005 13.6008 5.38005 13.6008 8.50005C13.6008 11.62 11.1208 14.1 8.00078 14.1ZM4.80078 7.70005V9.30005H11.2008V7.70005H4.80078Z"
								fill="#7E7E7E"
							/>
						</svg>

						<span className="ml-2">Remove</span>
					</button> */}
				</div>
			</div>
		</div>
	);
};

export default GooglePreviewItem;
