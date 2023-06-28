import CustomFontList from "./CustomFontList";
import { Link } from "react-router-dom";
import { __ } from "@wordpress/i18n";

const Welcome = () => {
	return (
		<div className="">
			<div className="bg-white border-b border-slate-200">
				<div className="max-w-3xl mx-auto px-6 py-4 lg:max-w-full">
					<div className="relative py-0">
						<div className="flex iphone:flex-col lg:flex-row md:flex-row justify-between items-center">
							<div>
								<h2 className="text-base font-medium tablet:mb-3">
									{ __( "Custom Fonts", "custom-fonts" ) }
								</h2>
							</div>
							<div className="relative">
								<Link
									to={{
										pathname: "themes.php",
										search: `?page=bsf-custom-fonts&path=add-fonts`,
									}}
									className="flex components-button is-secondary"
								>
									{ __("Add New Font", "custom-fonts") }
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="max-w-3xl mx-auto px-6 py-6 lg:max-w-full">
				{/* Font Listing Components */}
				{<CustomFontList />}
				<div className="mt-6 text-center">
					<Link
						to={{
							pathname: "themes.php",
							search: `?page=bsf-custom-fonts&path=add-fonts`,
						}}
						className="components-button is-primary"
					>
						{ __("Add New Font", "custom-fonts") }
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Welcome;
