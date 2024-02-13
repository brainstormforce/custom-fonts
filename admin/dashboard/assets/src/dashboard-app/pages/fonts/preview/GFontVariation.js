import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { __ } from "@wordpress/i18n";
import Custom_Fonts_Icons from "@Common/svg-icons";

const GFontVariation = (props) => {
	const { weight, font, isInGoogleState, disable } = props;
	const googleFont = useSelector( ( state ) => state.googleFont );
	const dispatch = useDispatch();
	const [removeTitle, setRemoveTitle] = useState( __( 'Remove', 'custom-fonts' ) );
	const [addTitle, setAddTitle] = useState( __( 'Add', 'custom-fonts' ) );

	useEffect(() => {
		if (!disable) {
			setRemoveTitle( __( 'Remove', 'custom-fonts' ) );
			setAddTitle( __( 'Add', 'custom-fonts' ) );
		}
	}, [disable]);

	const getFontWeightTitle = ( weight ) => {
		if ( undefined === weight ) {
			weight = '400';
		}
		let updatedWeight = weight,
			oldWeight = weight;
		if ( 'italic' === weight ) {
			oldWeight = '400italic';
		}
		if ( oldWeight.includes('italic') ) {
			updatedWeight = `${oldWeight.replace('italic', '')} ` + __( 'Italic', 'custom-fonts' );
		}
		switch ( weight ) {
			case '100':
			case '100italic':
				return __( 'Thin ', 'custom-fonts' ) + updatedWeight;
			case '200':
			case '200italic':
				return __( 'Extra Light ', 'custom-fonts' ) + updatedWeight;
			case '300':
			case '300italic':
				return __( 'Light ', 'custom-fonts' ) + updatedWeight;
			case '400':
			case '400italic':
				return __( 'Regular ', 'custom-fonts' ) + updatedWeight;
			case '500':
			case '500italic':
				return __( 'Medium ', 'custom-fonts' ) + updatedWeight;
			case '600':
			case '600italic':
				return __( 'Semi Bold ', 'custom-fonts' ) + updatedWeight;
			case '700':
			case '700italic':
				return __( 'Bold ', 'custom-fonts' ) + updatedWeight;
			case '800':
			case '800italic':
				return __( 'Extra Bold ', 'custom-fonts' ) + updatedWeight;
			case '900':
			case '900italic':
				return __( 'Ultra-Bold ', 'custom-fonts' ) + updatedWeight;
			default:
				return updatedWeight;
		}
	}

	const addWeight = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setRemoveTitle( __( 'Adding...', 'custom-fonts' ) );

		const varWt = e.target.dataset.font_weight;
		const variations = googleFont.variations;
		if ( undefined === varWt ) {
			return;
		}
		let style = varWt.includes('italic') ? 'italic' : 'normal';
		variations.push( {
			id: variations.length+1,
			font_file: '',
			font_style: style,
      font_weight: varWt,
    });
    dispatch({
      type: "SET_GOOGLE_FONT",
      payload: {
        font_name: googleFont.font_name,
        font_fallback: googleFont.font_fallback,
        font_display: googleFont.font_display,
        variations: variations,
      },
    });
    dispatch({ type: "IS_DB_UPDATE_REQUIRED", payload: {isDbUpdateRequired: true, editType: 'add' }});
  };

	const removeWeight = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setAddTitle( __( 'Removing...', 'custom-fonts' ) );

		const updatedVariations = googleFont.variations.filter(
			(variation) => variation.font_weight !== weight
		);

    dispatch({
      type: "SET_GOOGLE_FONT",
      payload: {
        font_name: googleFont.font_name ? googleFont.font_name : "",
        font_fallback: googleFont.font_fallback ? googleFont.font_fallback : "",
        font_display: googleFont.font_display ? googleFont.font_display : "",
        variations: updatedVariations,
      },
    });

    dispatch({ type: "IS_DB_UPDATE_REQUIRED", payload: { isDbUpdateRequired: true, editType: 'remove' }});
  };

	const getRenderFontWeight = (weight) => {
		if ( undefined === weight ) {
			weight = '400';
		}
		if ( weight.includes('italic') ) {
			return weight.replace( "italic", "" );
		}
		return weight;
	}

	const getFontStyle = (weight) => {
		if ( undefined === weight ) {
			weight = '400';
		}
		if ( weight.includes('italic') ) {
			return 'italic';
		} else {
			return 'normal';
		}
	}

	return (
		<div className="py-5">
			<div className="flex justify-between items-center">
				<div>
					{/* Variation Name */}
					<div className="text-sm font-normal text-neutral mb-3.5">
						{ getFontWeightTitle(weight) }
					</div>
					{/* Variation Preview */}
					<div className="text-5xl" style={{ fontFamily: font, fontWeight: getRenderFontWeight(weight), fontStyle:getFontStyle(weight), fontSize: "var(--bsf-custom-font-size)" }}>
						{__('How vexingly quick daft zebras jump!', 'custom-fonts')}
					</div>
				</div>
				<div>
					{!isInGoogleState && (
						<button
							disabled={disable}
							style={
								disable
									? addTitle === __( 'Removing...', 'custom-fonts' )
										? {
											color: "#3858E9",  // by removing time
											borderColor: "#3858E9",
											boxShadow: "inset 0 0 0 1px",
										}
										: {
											color: "grey",
											borderColor: "grey",
											boxShadow: "inset 0 0 0 1px",
										}
									: { boxShadow: "inset 0 0 0 1px" }
							}
							className={
								addTitle === __( 'Removing...', 'custom-fonts' )
									? "flex text-danger items-center components-button is-secondary border border-danger"
									: "flex items-center components-button is-secondary"
							}
							data-font_weight={weight}
							onClick={addWeight}
						>
							{addTitle === __( 'Removing...', 'custom-fonts' ) ? (Custom_Fonts_Icons['loadingSpinner3']) : (
								<span data-font_weight={weight}>
									{Custom_Fonts_Icons['iconsquare']}
								</span>
							)}
							<span className="ml-2" data-font_weight={weight}>
								{addTitle}
							</span>
						</button>
					)}
					{isInGoogleState && (
						<button
							disabled={disable}
							style={
								disable
									? removeTitle === __( 'Adding...', 'custom-fonts' )
										? {
											color: "#3858E9",
											borderColor: "#3858E9", // Updated border color
											boxShadow: "inset 0 0 0 1px",
										}
										: {
											color: "grey",
											borderColor: "grey",
											boxShadow: "inset 0 0 0 1px",
										}
									: { boxShadow: "inset 0 0 0 1px" }
							}
							className={
								removeTitle === __( 'Adding...', 'custom-fonts' )
									? "flex items-center components-button is-secondary"
									: "flex text-danger items-center components-button is-secondary border border-danger"
							}
							data-font_weight={weight}
							onClick={removeWeight}
						>
							{removeTitle === __( 'Adding...', 'custom-fonts' ) ? (Custom_Fonts_Icons['loadingSpinner3']) : (
								<span data-font_weight={weight}>
									{Custom_Fonts_Icons['iconsquare2']}
								</span>
							)}

							<span className="ml-2" data-font_weight={weight}>
								{removeTitle}
							</span>
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default GFontVariation;
