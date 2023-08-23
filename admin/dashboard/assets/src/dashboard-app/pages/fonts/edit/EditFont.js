import { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { __ } from '@wordpress/i18n';
import EditLocalFont from "./EditLocalFont";
import EditGoogleFont from "./EditGoogleFont";
import { RangeControl } from "@wordpress/components";
import EditGooglePreviewItem from "./preview/EditGooglePreviewItem";
import EditLocalPreviewItem from "./preview/EditLocalPreviewItem";
import globalDataStore from '@Admin/store/globalDataStore';
import setInitialState  from '@Utils/setInitialState';
import Custom_Fonts_Icons from "@Common/svg-icons";


const EditFont = ( props ) => {
	const {
		openPopup,
		setOpenPopup,
		font,
		fontName,
		fontType
	} = props;

	const [ open, setOpen ] = useState( openPopup );
	const [ previewSize, setPreviewSize ] = useState( '20' );
	const [fontUpdateAction, setFontUpdateAction] = useState('');
	const cancelButtonRef = useRef( null );

	const onCancelClick = () => {
		setOpenPopup( ! openPopup );
		setInitialState( globalDataStore );
	};

	useEffect( () => {
		setOpen( openPopup );
	}, [ openPopup ] );

	const onFontUpdated = (action) => {
		setFontUpdateAction(action);
	}

	return (
		<Transition.Root show={ open } as={ Fragment }>
			<Dialog as="div" className="ast-edit-font__dialog fixed backdrop-blur-sm inset-0 overflow-y-auto" initialFocus={ cancelButtonRef } onClose={ onCancelClick }>
				<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						as={ Fragment }
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
						&#8203;
					</span>
					<Transition.Child
						as={ Fragment }
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<Dialog.Panel className="bcf-edit-dialog-panel">
						<div className="inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[100%] sm:max-h-[50%] sm:w-full">
							<div className="bcf-edit-modal-close-wrapper absolute right-[-15px] p-0 top-[-15px] w-[25px] h-[25px]">
								<button
									type="button"
									className="mt-3 inline-flex justify-center border shadow-none border-slate-200 padding-[5px] bg-[#F6F7F7] text-base font-medium text-slate-800 focus:bg-[#F6F7F7] hover:bg-[#F6F7F7] focus:outline-none sm:mt-0 sm:text-xs bold border-none w-[20px] h-[20px] p-[3px] rounded-full shadow-md"
										onClick={onCancelClick}
										ref={cancelButtonRef}
									>
										 <span style={{ marginLeft: "-2px" }}>{Custom_Fonts_Icons['checkmarkIcon']}</span>
									</button>
								</div>
							<div className="grid grid-cols-12 sm:max-h-[60vh] overflow-auto">
								<style id={`bcf-font-${font}-preview-size-css`}> {`:root { --bsf-custom-font-size: ${previewSize}px }`} </style>
								<div id="gfont-edit-variation-data" hidden={true}></div>
								<div className="col-span-4 bg-white px-4 pt-5 pb-4 lg:p-[2em] sm:p-6">
									<div>
										{fontType === "local" && <EditLocalFont fontId={font} fontName={fontName} />}
										{fontType === "google" && <EditGoogleFont fontId={font} fontName={fontName} fontUpdateAction={fontUpdateAction} setFontUpdateAction={setFontUpdateAction} />}
									</div>
								</div>
								<div className="col-span-8 bg-[#F6F7F7] px-4 pt-5 pb-4 lg:p-[2em] sm:p-6">
									<div className="border-b border-light pb-5 flex justify-between items-center">
										<div className="text-base font-medium text-secondary">
											{__('Font Preview', 'custom-fonts')}
										</div>
										<div className="w-[314px] pr-[20px]">
											<RangeControl
												className="bcf-font-size-range"
												onChange={(value) => setPreviewSize(value)}
												min={1}
												max={100}
												step={1}
												value={parseInt(previewSize)}
											/>
										</div>
									</div>
									<div className="py-5 divide-y">
										<div>
											{fontType === "local" && <EditLocalPreviewItem fontId={font} fontName={fontName} />}
											{fontType === "google" && <EditGooglePreviewItem fontId={font} fontName={fontName} onFontUpdated={onFontUpdated}/>}
										</div>
									</div>
								</div>
							</div>
						</div>
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	)
};

export default EditFont;
