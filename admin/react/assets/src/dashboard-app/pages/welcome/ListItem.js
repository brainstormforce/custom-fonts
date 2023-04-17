import React, { useState } from "react";

const ListItem = () => {
	const [active, setActive] = useState(false);
	const [checkDelete, setCheckDelete] = useState(false);
	return (
		<div className={`${active || checkDelete ? "bg-white" : ""} transition-colors px-6`}>
			<div className="flex items-center justify-between py-5">
				<div className="flex items-center">
					<h1 className="text-xl">Satoshi</h1>
					<div className="ml-3 text-sm">(3 variants)</div>
				</div>
				<div className="flex">
					{checkDelete ? (
						<div className="flex gap-x-6">
							<div className="text-secondary">
								Remove "Satoshi" font?
							</div>
							<a
								onClick={() => setCheckDelete(false)}
								className="text-neutral cursor-pointer"
							>
								Cancel
							</a>

							<a href="" className="text-danger cursor-pointer">
								Remove
							</a>
						</div>
					) : (
						<a
							onClick={() => setCheckDelete(true)}
							className="text-danger cursor-pointer"
						>
							Remove
						</a>
					)}

					<div
						onClick={() => setActive(!active)}
						className="ml-11 cursor-pointer"
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className={`${
								active ? "rotate-180" : ""
							} transition-transform duration-150 ease-in-out`}
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
			{active && (
				<div>
					<div className="py-5 border-t border-light">
						<div className="text-sm text-neutral">Regular 400</div>
						<h3 className="text-5xl text-heading font-normal">
							How vexingly quick daft zebras jump!
						</h3>
					</div>
					<div className="py-5 border-t border-light">
						<div className="text-sm text-neutral">Semibold 600</div>
						<h3 className="text-5xl text-heading font-semibold">
							How vexingly quick daft zebras jump!
						</h3>
					</div>
				</div>
			)}
		</div>
	);
};

export default ListItem;
