<?php
/**
 * Bsf Custom fonts - Init
 *
 * @package Bsf_Custom_Fonts
 */

if ( ! class_exists( 'Bsf_Custom_Fonts' ) ) {

	/**
	 * Bsf Custom fonts
	 *
	 * @since 1.0.0
	 */
	class Bsf_Custom_Fonts {

		/**
		 * Member Varible
		 *
		 * @var object instance
		 */
		private static $instance;

		/**
		 *  Initiator
		 */
		public static function get_instance() {
			if ( ! isset( self::$instance ) ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Constructor function that initializes required actions and hooks
		 */
		public function __construct() {
			require_once BSF_CUSTOM_FONTS_DIR . 'includes/class-bsf-custom-fonts-taxonomy.php';
			require_once BSF_CUSTOM_FONTS_DIR . 'includes/class-bsf-custom-fonts-admin.php';

			require_once BSF_CUSTOM_FONTS_DIR . 'classes/class-bsf-custom-fonts-render.php';
			require_once BSF_CUSTOM_FONTS_DIR . 'classes/class-bsf-custom-fonts-white-label.php';
		}
	}

	/**
	 *  Kicking this off by calling 'get_instance()' method
	 */
	Bsf_Custom_Fonts::get_instance();
}
