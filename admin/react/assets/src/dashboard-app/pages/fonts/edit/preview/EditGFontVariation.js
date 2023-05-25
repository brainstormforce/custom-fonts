import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { __ } from "@wordpress/i18n";

const EditGFontVariation = (props) => {
	const { weight, font, isInGoogleState } = props;
	const dispatch = useDispatch();

	const toBeEditFont = useSelector( ( state ) => state.editFont );
	const [editFontData, setEditGoogleFontData] = useState( toBeEditFont );

	useEffect(() => {
		dispatch( { type: 'SET_EDIT_FONT', payload: editFontData } );
	}, [editFontData]);

	const getFontWeightTitle = ( weight ) => {
		switch ( weight ) {
			case '100':
				return __( 'Thin ', 'custom-fonts' ) + weight;
			case '200':
				return __( 'Extra Light ', 'custom-fonts' ) + weight;
			case '300':
				return __( 'Light ', 'custom-fonts' ) + weight;
			case '400':
				return __( 'Regular ', 'custom-fonts' ) + weight;
			case '500':
				return __( 'Medium ', 'custom-fonts' ) + weight;
			case '600':
				return __( 'Semi Bold ', 'custom-fonts' ) + weight;
			case '700':
				return __( 'Bold ', 'custom-fonts' ) + weight;
			case '800':
				return __( 'Extra Bold ', 'custom-fonts' ) + weight;
			case '900':
				return __( 'Black ', 'custom-fonts' ) + weight;
			default:
				return __( 'Weight ', 'custom-fonts' ) + weight;
		}
	}

	const addWeight = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const varWt = e.target.dataset.font_weight;

		const variations = editFontData.variations;
		if ( undefined === varWt ) {
			return;
		}
		variations.push( {
			id: (variations.length+1).toString(),
			font_file: '',
			font_style: '',
			font_weight: varWt
		} );

		setEditGoogleFontData({
			...editFontData,
			variations: variations,
		});
	}

	const removeWeight = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const varWt = (e.target.dataset.font_weight).toString();

		const updatedVariations = editFontData.variations.filter(
			(variation) => variation.font_weight !== varWt
		);

		setEditGoogleFontData({
			...editFontData,
			variations: updatedVariations,
		});
	}

	const getRenderFontWeight = (weight) => {
		return weight.replace( "italic", "" );
	}

	console.error( editFontData );

	return (
		<div className="py-5">
			<div className="flex justify-between items-center">
				<div>
					{/* Variation Name */}
					<div className="text-sm text-neutral mb-3.5">
						{ getFontWeightTitle(weight) }
					</div>
					{/* Variation Preview */}
					<div className="text-5xl" style={{ fontFamily: font, fontWeight: getRenderFontWeight(weight), fontSize: "var(--bsf-custom-font-size)" }}>
						{__('How vexingly quick daft zebras jump!', 'custom-fonts')}
					</div>
				</div>
				<div>
					{ ( ! isInGoogleState ) &&
						<button className="flex text-sm text-primary items-center py-2 px-3 border border-primary" data-font_weight={weight} onClick={addWeight}>
							<svg
								width="16"
								height="17"
								viewBox="0 0 16 17"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								data-font_weight={weight}
								onClick={addWeight}
							>
								<path
									d="M8.00078 1.30005C4.00078 1.30005 0.800781 4.50005 0.800781 8.50005C0.800781 12.5 4.00078 15.7 8.00078 15.7C12.0008 15.7 15.2008 12.5 15.2008 8.50005C15.2008 4.50005 12.0008 1.30005 8.00078 1.30005ZM8.00078 14.1C4.88078 14.1 2.40078 11.62 2.40078 8.50005C2.40078 5.38005 4.88078 2.90005 8.00078 2.90005C11.1208 2.90005 13.6008 5.38005 13.6008 8.50005C13.6008 11.62 11.1208 14.1 8.00078 14.1ZM8.80078 5.30005H7.20078V7.70005H4.80078V9.30005H7.20078V11.7H8.80078V9.30005H11.2008V7.70005H8.80078V5.30005Z"
									fill="#007CBA"
								/>
							</svg>
							<span className="ml-2" data-font_weight={weight}>{__('Add', 'custom-fonts')}</span>
						</button>
					}
					{ isInGoogleState &&
						<button className="flex text-sm text-neutral items-center py-2 px-3 border border-neutral" data-font_weight={weight} onClick={removeWeight}>
							<svg
								width="16"
								height="17"
								viewBox="0 0 16 17"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								data-font_weight={weight}
								onClick={removeWeight}
							>
								<path
									d="M8.00078 1.30005C4.00078 1.30005 0.800781 4.50005 0.800781 8.50005C0.800781 12.5 4.00078 15.7 8.00078 15.7C12.0008 15.7 15.2008 12.5 15.2008 8.50005C15.2008 4.50005 12.0008 1.30005 8.00078 1.30005ZM8.00078 14.1C4.88078 14.1 2.40078 11.62 2.40078 8.50005C2.40078 5.38005 4.88078 2.90005 8.00078 2.90005C11.1208 2.90005 13.6008 5.38005 13.6008 8.50005C13.6008 11.62 11.1208 14.1 8.00078 14.1ZM4.80078 7.70005V9.30005H11.2008V7.70005H4.80078Z"
									fill="#7E7E7E"
								/>
							</svg>
							<span className="ml-2" data-font_weight={weight}>{__('Remove', 'custom-fonts')}</span>
						</button>
					}
				</div>
			</div>
		</div>
	);
};

export default EditGFontVariation;
