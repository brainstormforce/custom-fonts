import React from "react";

const LocalFont = () => {
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
					<div>
						<input className="w-full" type="text" />
					</div>
				</div>
				<div className="mb-5">
					<label className="w-full text-sm text-heading" htmlFor="">
						Advanced Options
					</label>
				</div>
				<div className="relative border border-outline p-4">
					<div className="mb-3">
						<input type="file" />
						<div>
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
								<select className="w-full" name="" id="">
									<option value="">Normal</option>
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
								<input type="text" className="w-full" />
							</div>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-x-1 my-5">
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

				<button className="button button-primary">
					Save Font
				</button>
			</div>
		</div>
	);
};

export default LocalFont;
