import { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";

const FontNotification = () => {
	const [show, setShow] = useState(true);

	return (
		<>
			{/* Global notification live region, render this permanently at the end of the document */}
			<div
				aria-live="assertive"
				className="pointer-events-none fixed inset-0 top-5 left-60 flex items-end px-4 py-6 sm:items-start sm:p-6"
			>
				<div className="flex w-full flex-col items-center space-y-4 sm:items-center">
					{/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
					<Transition
						show={show}
						as={Fragment}
						enter="transform ease-out duration-300 transition"
						enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
						enterTo="translate-y-0 opacity-100 sm:translate-x-0"
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="pointer-events-auto w-full max-w-[25rem] overflow-hidden border-l-4 border-[#00A32A]  bg-white shadow-lg ring-1 ring-light ring-opacity-5">
							<div className="p-4">
								<div className="flex justify-between items-center">
									<div className="text-xs text-secondary">
										Satoshi font added. <span className="text-primary cursor-pointer">Manage font</span>
									</div>
									<div className="ml-4 flex flex-shrink-0">
										<button
											type="button"
											className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
											onClick={() => {
												setShow(false);
											}}
										>
											<span className="sr-only">
												Close
											</span>
											<svg
												width="16"
												height="16"
												viewBox="0 0 16 16"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M7.99961 1.6001C11.5356 1.6001 14.3996 4.4641 14.3996 8.0001C14.3996 11.5361 11.5356 14.4001 7.99961 14.4001C4.46361 14.4001 1.59961 11.5361 1.59961 8.0001C1.59961 4.4641 4.46361 1.6001 7.99961 1.6001ZM11.9996 10.4001L9.59961 8.0001L11.9996 5.6001L10.3996 4.0001L7.99961 6.4001L5.59961 4.0001L3.99961 5.6001L6.39961 8.0001L3.99961 10.4001L5.59961 12.0001L7.99961 9.6001L10.3996 12.0001L11.9996 10.4001Z"
													fill="#7E7E7E"
												/>
											</svg>
										</button>
									</div>
								</div>
							</div>
						</div>
					</Transition>
				</div>
			</div>
		</>
	);
};

export default FontNotification;
