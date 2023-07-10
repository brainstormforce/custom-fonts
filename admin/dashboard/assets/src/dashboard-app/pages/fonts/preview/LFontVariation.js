import React from "react";
import { __ } from "@wordpress/i18n";
import getFontWeightTitle from '../../../../common/fontcommon';

const LFontVariation = (props) => {
	const { weight, font, fontUrl, style } = props;

	if ( '' === fontUrl ) {
		return;
	}

	useEffect(()=>{getFontWeightTitle(weight,style);
	},[])

	return (
		<div className="py-5">
			<div>
				<div className="text-sm font-normal text-neutral mb-3.5"> { getFontWeightTitle(weight, style) } </div>
				<div className="text-5xl" style={{ fontFamily: font, fontWeight: weight, fontStyle: style, fontSize: "var(--bsf-custom-font-size)" }}>
					{__('How vexingly quick daft zebras jump!', 'custom-fonts')}
				</div>
			</div>
		</div>
	);
};

export default LFontVariation;
